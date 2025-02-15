import TitleCard from "../../../components/Cards/TitleCard";

const userSourceData = [
  { source: "Facebook Ads", count: "26,345", conversionPercent: 10.2 },
  { source: "Google Ads", count: "21,341", conversionPercent: 11.7 },
  { source: "Instagram Ads", count: "34,379", conversionPercent: 12.4 },
  { source: "Affiliates", count: "12,359", conversionPercent: 20.9 },
  { source: "Organic", count: "10,345", conversionPercent: 10.3 },
];

function UserChannels({}) {
  return (
    <div className={"card w-full p-6 bg-base-100 shadow-xl "}>
      <div className="text-center justify-center">
        <p className="text-4xl font-bold ">Selamat Datang</p>
      </div>
    </div>
  );
}

export default UserChannels;
