

function UserChannels({}) {
  return (
    <div className="flex justify-center  bg-base-200">
      <div className="card w-full max-w-2xl p-8 bg-base-100 shadow-2xl rounded-2xl text-center animate-fade-in">
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
        <button className="btn btn-primary mt-6 px-6 py-3 rounded-lg text-white">
          Masuk ke Dashboard
        </button>
      </div>
    </div>
  );
}

export default UserChannels;
