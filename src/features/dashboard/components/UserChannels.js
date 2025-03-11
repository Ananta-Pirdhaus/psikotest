import {
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

function UserChannels({}) {
  const colors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
    "text-pink-500",
  ];

  const bgColors = [
    "bg-red-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
  ];

  const cards = [
    {
      title: "Hasil Test",
      icon: AcademicCapIcon,
      url: "/app/hasil-quiz",
    },
    {
      title: "Master Jurusan",
      icon: AdjustmentsHorizontalIcon,
      url: "/app/master-jurusan",
    },
    {
      title: "Master Bakat",
      icon: ClipboardDocumentListIcon,
      url: "/app/master-bakat",
    },
    {
      title: "Peserta Quiz",
      icon: UsersIcon,
      url: "/app/peserta",
    },
    {
      title: "Master Soal",
      icon: DocumentTextIcon,
      url: "/app/master-soal",
    },
    {
      title: "Master Perguruan Tinggi",
      icon: BuildingLibraryIcon,
      url: "/app/master-kampus",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="card w-full max-w-2xl p-8 bg-white shadow-2xl rounded-2xl text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="text-primary text-6xl">
            <i className="fas fa-user-shield"></i>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-neutral">
          Selamat Datang, Admin
        </h1>
        <p className="text-lg text-neutral-700 mt-2">
          Selamat datang di panel administrasi. Pantau dan kelola sistem dengan
          efisiensi, pastikan setiap aspek berjalan optimal, dan buat keputusan
          berdasarkan data yang akurat.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => (window.location.href = card.url)}
            className={`cursor-pointer card w-48 p-6 rounded-xl flex flex-col items-center text-center shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${bgColors[index]}`}
          >
            <card.icon className={`w-12 h-12 ${colors[index]}`} />
            <h2 className="text-lg font-semibold text-gray-700 mt-2">
              {card.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserChannels;
