import { Injectable } from '@nestjs/common';
import { extractColorsFromSrc } from 'extract-colors';

@Injectable()
export class ColorsService {
  async getColors(url: string) {
    const colors = await extractColorsFromSrc(url);
    const sortedColors = colors
      .map((c) => ({
        ...c,
        colorfulness: this.colorfulness(c.red, c.green, c.blue),
      }))
      .filter((c) => c.colorfulness >= 10)
      .sort((a, b) => b.area - a.area);

    let topColor = {
      red: sortedColors[0].red,
      green: sortedColors[0].green,
      blue: sortedColors[0].blue,
    };
    if (!topColor) topColor = { red: 230, green: 230, blue: 230 };

    return `rgb(${topColor.red}, ${topColor.green}, ${topColor.blue})`;
  }

  private colorfulness(r: number, g: number, b: number) {
    const rg = Math.abs(r - g);
    const yb = Math.abs(0.5 * (r + g) - b);

    const rg_mean = rg;
    const rg_std = 0;
    const yb_mean = yb;
    const yb_std = 0;

    const std_root = Math.sqrt(rg_std ** 2 + yb_std ** 2);
    const mean_root = Math.sqrt(rg_mean ** 2 + yb_mean ** 2);

    return std_root + 0.3 * mean_root;
  }
}
