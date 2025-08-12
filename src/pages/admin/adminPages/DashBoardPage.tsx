import { AdminLayout } from "../../../layouts/AdminLayouts";

export const AdminDashboardPage = () => (
  <AdminLayout>
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Users",
            value: "2,847",
            color: "from-cyan-500 to-blue-500",
          },
          {
            title: "Active Problems",
            value: "156",
            color: "from-purple-500 to-pink-500",
          },
          {
            title: "Submissions",
            value: "18,291",
            color: "from-emerald-500 to-teal-500",
          },
          {
            title: "Job Posts",
            value: "89",
            color: "from-orange-500 to-red-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl"
          >
            <div
              className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color} animate-pulse mb-4`}
            ></div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-slate-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">
          Welcome to Admin Dashboard
        </h2>
        <p className="text-slate-400">
          This is a dummy dashboard page. Use the sidebar to navigate to
          different sections.
        </p>
      </div>
    </div>
  </AdminLayout>
);
