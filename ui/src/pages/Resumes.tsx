function Resumes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Resumes
          </h1>
          <p className="text-gray-600">
            View published resumes here
          </p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-center">
            Resume listing will be displayed here
          </p>
        </div>
      </div>
    </div>
  )
}

export default Resumes
