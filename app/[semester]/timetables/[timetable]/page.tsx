import Timetable from "@/components/timetable";

interface PageProps{
  params: {
    semesterId: string;
  };
}

export default function Page({ params }: PageProps) {
  return <Timetable semesterId={params.semesterId} />;
}