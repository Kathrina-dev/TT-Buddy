import TT_collection  from "@/components/tt-collection";

interface PageProps{
  params: {
    semesterId: string;
    timetableId: string;
  };
}

export default function Page({ params }: PageProps) {
  return <TT_collection semesterId={params.semesterId} timetableId={params.timetableId} />;
}
