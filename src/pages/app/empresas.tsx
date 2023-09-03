import { columns } from "@/components/CompaniesTable/columns";
import { CompaniesTable } from "@/components/CompaniesTable/data-table";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/utils/api";

export default function Companies() {
  const { data, isLoading } = api.companies.listCompanies.useQuery({
    limit: 40,
    page: 1,
  });

  if (isLoading) {
    return <AppLayout>Carregando...</AppLayout>;
  }

  const companies = data?.companies ?? [];

  return (
    <AppLayout>
      <div className="bg-white p-6">
        <header className="mb-6 flex items-center justify-between ">
          <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-slate-600 transition-colors first:mt-0">
            Empresas
          </h1>

          <Button variant="secondary">Nova empresa</Button>
        </header>

        <CompaniesTable columns={columns} data={companies} />
      </div>
    </AppLayout>
  );
}
