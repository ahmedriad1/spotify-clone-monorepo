import { isBrowser } from '@spotify-clone-monorepo/utils';
import { useRouter } from 'next/router';
import { NextPage, NextPageContext } from 'next/types';

interface WithConditionalRedirectProps {
  WrappedComponent: NextPage;
  clientCondition: () => boolean;
  serverCondition: (ctx: NextPageContext) => boolean;
  location: string;
}

const withConditionalRedirect = ({
  WrappedComponent,
  clientCondition,
  serverCondition,
  location,
}: WithConditionalRedirectProps) => {
  const WithConditionalRedirectWrapper: NextPage = (props) => {
    const router = useRouter();
    const redirectCondition = clientCondition();
    if (isBrowser() && redirectCondition) {
      router.push(location);
      return null;
    }
    return <WrappedComponent {...props} />;
  };

  WithConditionalRedirectWrapper.getInitialProps = async (ctx) => {
    if (!isBrowser() && ctx.res) {
      if (serverCondition(ctx)) {
        ctx.res.writeHead(302, { Location: location });
        ctx.res.end();
      }
    }

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps };
  };

  return WithConditionalRedirectWrapper;
};

export default withConditionalRedirect;
