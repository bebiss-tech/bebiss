import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlarmClock, CheckCircle, Clock, XCircle } from "lucide-react";

export default function Home() {
  return (
    <main>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <AlarmClock size={15} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">121</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <CheckCircle size={15} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
            <XCircle size={15} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <Clock size={15} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">74</div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
