import { Fragment, useEffect, useState } from "react"
import { Transition } from "@headlessui/react"
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/20/solid"

export interface NotificationProps {
  title: string;
  description: string;
  show: boolean;
  timeout: number;
  error?: boolean;
  onClose?: () => void;
}

export function Notification ({ title, description, show, error, onClose, timeout }: NotificationProps) {
  const [timeoutId, setTimeoutId] = useState(null);
  // Timeout
  useEffect(() => {
    clearTimeout(timeoutId);
    if (timeout > 0)
      setTimeoutId(setTimeout(() => onClose?.(), timeout));
  }, [title, description, show, onClose, timeout]);
  // Render
  return (
    <>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start z-20 sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {
                      !error &&
                      <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                    }
                    {
                      error &&
                      <ExclamationCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                    }
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {title}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {description}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => onClose?.()}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}