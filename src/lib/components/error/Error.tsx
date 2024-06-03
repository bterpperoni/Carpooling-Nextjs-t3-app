

export default function Error({ statusCode }: { statusCode: number }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Error {statusCode}</h1>
      <p className="text-2xl mt-4">An error occurred on server</p>
    </div>
  );
}