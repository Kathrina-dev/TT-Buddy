import SemesterSetup from "@/components/setup-courses";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({params}: PageProps) {
  return <SemesterSetup id= {params.id} />;
}