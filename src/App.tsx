import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ContentProvider } from "@/store/content";
import { InvestorProvider } from "@/store/investors";
import { PortalRI } from "@/pages/PortalRI";
import { LoginInvestidor } from "@/pages/investidor/Login";
import { LoginAdmin } from "@/pages/admin/Login";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { DashboardAdmin } from "@/pages/admin/Dashboard";
import { Investidores } from "@/pages/admin/Investidores";
import {
  Campanhas,
  Templates,
  Historico,
  Configuracoes,
} from "@/pages/admin/Stubs";
import { ConteudoOverview } from "@/pages/admin/Conteudo";
import { ConteudoComunicados } from "@/pages/admin/ConteudoComunicados";
import { ConteudoEventos } from "@/pages/admin/ConteudoEventos";
import { ConteudoDocumentos } from "@/pages/admin/ConteudoDocumentos";
import { ConteudoKit } from "@/pages/admin/ConteudoKit";
import { ConteudoTextos } from "@/pages/admin/ConteudoTextos";

function App() {
  return (
    <ContentProvider>
      <InvestorProvider>
        <BrowserRouter>
        <Routes>
          {/* Portal R.I. público */}
          <Route path="/" element={<PortalRI />} />

          {/* Área do investidor */}
          <Route path="/investidor/login" element={<LoginInvestidor />} />

          {/* Painel admin */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="investidores" element={<Investidores />} />
            <Route path="campanhas" element={<Campanhas />} />
            <Route path="campanhas/nova" element={<Campanhas />} />
            <Route path="templates" element={<Templates />} />
            <Route path="historico" element={<Historico />} />
            <Route path="configuracoes" element={<Configuracoes />} />

            {/* Conteúdo do site */}
            <Route path="conteudo" element={<ConteudoOverview />} />
            <Route
              path="conteudo/comunicados"
              element={<ConteudoComunicados />}
            />
            <Route path="conteudo/eventos" element={<ConteudoEventos />} />
            <Route
              path="conteudo/documentos"
              element={<ConteudoDocumentos />}
            />
            <Route path="conteudo/kit" element={<ConteudoKit />} />
            <Route path="conteudo/textos" element={<ConteudoTextos />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </InvestorProvider>
    </ContentProvider>
  );
}

export default App;
