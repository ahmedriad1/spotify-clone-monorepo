import { XCircleIcon } from '@heroicons/react/outline';
import { forwardRef } from 'react';
import ConnectForm from './ConnectForm';
import InputErrorMsg from './InputErrorMsg';
import IsolateRerender from './IsolateRerender';

export interface BaseFileUploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  id: string;
}

const BaseFileUpload: React.FC<BaseFileUploadProps> = forwardRef<
  HTMLInputElement,
  BaseFileUploadProps
>(({ label, icon, id, ...props }, ref) => {
  return (
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        {icon}
        <div className="flex text-sm text-white">
          <label
            htmlFor={id}
            className="relative cursor-pointer bg-black rounded-md font-medium text-sp-green px-2"
          >
            <span>Upload a file</span>
            <input
              type="file"
              id={id}
              className="sr-only"
              {...{ ...props, ref }}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  );
});

interface FileUploadProps {
  name: string;
  preview?: (value: File, options: { clear: () => void }) => React.ReactElement;
  defaultValue?: unknown;
  label: string;
  icon: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  preview,
  defaultValue,
  ...props
}) => {
  const getFileSrc = (file: FileList) =>
    file instanceof FileList ? URL.createObjectURL(file[0]) : file;

  return (
    <ConnectForm>
      {({ register, setValue, formState: { errors } }) => (
        <>
          <IsolateRerender fieldToWatch={name} defaultValue={defaultValue}>
            {({ [name]: file }) => {
              const clear = () =>
                file
                  ? setValue(name, null, {
                      shouldDirty: true,
                    })
                  : undefined;
              const fileList = file as FileList;
              return file && fileList[0] && !errors[name] ? (
                preview ? (
                  preview(fileList[0], {
                    clear,
                  })
                ) : (
                  <div className="w-[200px] h-[200px] mt-1 relative group">
                    <img
                      src={getFileSrc(fileList)}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                    <div className="bg-black bg-opacity-50 w-full h-full absolute top-0 flex justify-center items-center opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 ease-in-out">
                      <button
                        className="text-white h-10 w-10"
                        type="button"
                        onClick={clear}
                      >
                        <XCircleIcon className="h-full w-full" />
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <BaseFileUpload id={name} {...register(name)} {...props} />
              );
            }}
          </IsolateRerender>
          <InputErrorMsg error={errors[name]} />
        </>
      )}
    </ConnectForm>
  );
};

export default FileUpload;
