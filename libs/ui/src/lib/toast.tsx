import { Transition } from '@headlessui/react';
import { IGraphQLError } from '@spotify-clone-monorepo/auth';
import { toast as makeToast } from 'react-hot-toast';

const toast = (type: 'error' | 'success', message: string | IGraphQLError) => {
  const err =
    typeof message === 'string'
      ? message
      : message?.response?.data?.errors[0]?.message || 'An error occurred';

  return makeToast.custom(
    (t) => (
      <div className="max-w-md w-full text-white">
        <Transition
          show={t.visible}
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 -translate-y-3"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-3"
        >
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } bg-black shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-3 px-5">
              <div className="flex items-center text-base">
                <svg
                  className={`w-6 h-6 mr-4 stroke-current ${
                    type === 'success' ? 'text-sp-green' : 'text-red-500'
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {type === 'success' ? (
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  ) : (
                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  )}
                </svg>

                {err}
              </div>
            </div>
            <div className="flex border-l border-[#121212]">
              <button
                onClick={() => makeToast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-3 px-5 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </Transition>
      </div>
    ),
    { duration: 3000 }
  );
};

export default toast;
