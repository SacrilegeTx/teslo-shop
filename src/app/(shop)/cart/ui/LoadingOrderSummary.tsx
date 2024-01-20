export function LoadingOrderSummary() {
  return (
    <div className="flex flex-col justify-center rounded-xl p-7">
      <div className="flex animate-pulse flex-col justify-center rounded-xl p-7">
        <div className="mb-10">
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
        </div>
        {/* Divider */}
        <hr className="my-5 mb-10 h-0.5 w-full rounded bg-gray-200" />
        <div className="my-2 flex flex-row justify-between">
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
        </div>
        <div className="my-2 flex flex-row justify-between">
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
        </div>
        <div className="my-2 flex flex-row justify-between">
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
        </div>
        <div className="my-5 flex flex-row justify-between">
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
        </div>
        <div className="mb-2 mt-5 w-full">
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
