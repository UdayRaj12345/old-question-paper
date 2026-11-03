
const contributors = [
  {
    rank: 1,
    name: "Aarav Sharma",
    department: "Computer Science",
    uploads: 25,
    points: 250,
  },
  {
    rank: 2,
    name: "Priya Verma",
    department: "BCA",
    uploads: 18,
    points: 180,
  },
  {
    rank: 3,
    name: "Rahul Singh",
    department: "Information Technology",
    uploads: 12,
    points: 120,
  },
  {
    rank: 4,
    name: "Ananya Gupta",
    department: "BBA",
    uploads: 9,
    points: 90,
  },
  {
    rank: 5,
    name: "Rohan Kumar",
    department: "Computer Science",
    uploads: 7,
    points: 70,
  },
]

export default function LeaderboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200">

      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Top Contributors
      </h1>

      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Recognizing students who help others learn and grow by sharing
        academic resources.
      </p>

      <div className="space-y-4">
        {contributors.map((student) => (
          <div
            key={student.rank}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                {student.rank}
              </div>

              <div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {student.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {student.department}
                </p>
              </div>
            </div>

            <div className="flex gap-8 sm:gap-10">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {student.uploads}
                </p>
                <p className="text-sm text-gray-500">Uploads</p>
              </div>

              <div>
                <p className="font-bold text-primary">
                  {student.points}
                </p>
                <p className="text-sm text-gray-500">Points</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        Rankings are based on contributions to the PaperHub community.
      </p>

    </div>
  )
}
