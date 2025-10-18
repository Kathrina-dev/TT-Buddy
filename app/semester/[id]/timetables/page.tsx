import TimetablesList from "@/components/tt-list";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({params}: PageProps) {
  return <TimetablesList id= {params.id} />;
}