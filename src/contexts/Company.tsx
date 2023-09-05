import { api } from "@/utils/api";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type SelectedCompany = {
  label: string;
  value: string;
};

type Company = {
  address: string;
  whatsapp: string;
  name: string;
  id: string;
  phone: string;
};

type CompanyResponse = {
  companies: Company[];
  count: number;
  totalPages: number;
  limit: number;
};

type CompanyContextData = {
  isLoading: boolean;
  isSuccess: boolean;
  companies: CompanyResponse | undefined;
  company: SelectedCompany;
  setCompany: Dispatch<SetStateAction<SelectedCompany>>;
};

const CompanyContext = createContext({} as CompanyContextData);

export const useCompany = () => useContext(CompanyContext);

type CompanyProviderProps = {
  children: ReactNode;
};

const CompanyProvider = ({ children }: CompanyProviderProps) => {
  const [company, setCompany] = useState<SelectedCompany>({
    label: "",
    value: "",
  });

  const {
    data: companies,
    isSuccess,
    isLoading,
  } = api.companies.listCompanies.useQuery({
    limit: 40,
    page: 1,
  });

  useEffect(() => {
    if (isSuccess && companies?.companies?.length) {
      setCompany({
        label: companies.companies.at(0)!.name,
        value: companies.companies.at(0)!.id,
      });
    }
  }, [isSuccess, companies]);

  return (
    <CompanyContext.Provider
      value={{
        isLoading,
        isSuccess,
        companies,
        company,
        setCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
