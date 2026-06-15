import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/store/auth";
import { ContentProvider } from "@/store/content";
import { InvestorProvider } from "@/store/investors";
import { PortalRI } from "@/pages/PortalRI";
import { Demonstracoes } from "@/pages/Demonstracoes";
import { PaginaEmBreve } from "@/pages/PaginaEmBreve";
import { QuemSomos } from "@/pages/QuemSomos";
import { FaleComRi } from "@/pages/FaleComRi";
import { LoginInvestidor } from "@/pages/investidor/Login";
import { AreaInvestidor } from "@/pages/investidor/Area";
import { LoginAdmin } from "@/pages/admin/Login";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { DashboardAdmin } from "@/pages/admin/Dashboard";
import { Investidores } from "@/pages/admin/Investidores";
import { Usuarios } from "@/pages/admin/Usuarios";
import { Campanhas } from "@/pages/admin/Campanhas";
import { CampanhaNova } from "@/pages/admin/CampanhaNova";
import { Templates } from "@/pages/admin/Templates";
import { Historico } from "@/pages/admin/Historico";
import { Configuracoes } from "@/pages/admin/Configuracoes";
import { ConteudoOverview } from "@/pages/admin/Conteudo";
import { ConteudoEventos } from "@/pages/admin/ConteudoEventos";
import { ConteudoDocumentos } from "@/pages/admin/ConteudoDocumentos";
import { ConteudoKit } from "@/pages/admin/ConteudoKit";
import { ConteudoTextos } from "@/pages/admin/ConteudoTextos";
import { ConteudoNavegacao } from "@/pages/admin/ConteudoNavegacao";
import { ConteudoAcoesRapidas } from "@/pages/admin/ConteudoAcoesRapidas";
import { ConteudoRodape } from "@/pages/admin/ConteudoRodape";
import { ConteudoFaq } from "@/pages/admin/ConteudoFaq";
import { ConteudoFatosRelevantes } from "@/pages/admin/ConteudoFatosRelevantes";
import { ScrollToHash } from "@/components/ScrollToHash";

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
      <InvestorProvider>
        <BrowserRouter>
          <ScrollToHash />
          <Routes>
            {/* Portal R.I. público */}
            <Route path="/" element={<PortalRI />} />
            <Route path="/demonstracoes" element={<Demonstracoes />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/fale-com-ri" element={<FaleComRi />} />

            {/* Páginas placeholder (em construção / em breve) */}
            <Route
              path="/em-construcao"
              element={
                <PaginaEmBreve
                  titulo="Em construção"
                  mensagem="Esta área está sendo preparada e ficará disponível em breve. Agradecemos a compreensão."
                />
              }
            />
            <Route
              path="/resultados"
              element={
                <PaginaEmBreve
                  titulo="Resultados trimestrais"
                  mensagem="Os resultados serão divulgados em breve. Fique atento aos próximos comunicados."
                />
              }
            />
            <Route
              path="/apresentacao"
              element={
                <PaginaEmBreve
                  titulo="Apresentação institucional"
                  mensagem="Em breve será divulgada a apresentação institucional do Grupo ICA."
                />
              }
            />
            <Route
              path="/contato"
              element={
                <PaginaEmBreve
                  titulo="Formas de contato"
                  mensagem="Em breve disponibilizaremos os canais de atendimento ao investidor. Enquanto isso, escreva para ri@grupoica.com.br."
                />
              }
            />

            {/* Área do investidor */}
            <Route path="/investidor/login" element={<LoginInvestidor />} />
            <Route path="/investidor/area" element={<AreaInvestidor />} />

            {/* Painel admin */}
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/admin" element={<AdminShell />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardAdmin />} />
              <Route path="investidores" element={<Investidores />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="campanhas" element={<Campanhas />} />
              <Route path="campanhas/nova" element={<CampanhaNova />} />
              <Route path="templates" element={<Templates />} />
              <Route path="historico" element={<Historico />} />
              <Route path="configuracoes" element={<Configuracoes />} />

              {/* Conteúdo do site */}
              <Route path="conteudo" element={<ConteudoOverview />} />
              <Route path="conteudo/eventos" element={<ConteudoEventos />} />
              <Route path="conteudo/documentos" element={<ConteudoDocumentos />} />
              <Route path="conteudo/kit" element={<ConteudoKit />} />
              <Route path="conteudo/textos" element={<ConteudoTextos />} />
              <Route path="conteudo/navegacao" element={<ConteudoNavegacao />} />
              <Route path="conteudo/acoes" element={<ConteudoAcoesRapidas />} />
              <Route path="conteudo/rodape" element={<ConteudoRodape />} />
              <Route path="conteudo/faq" element={<ConteudoFaq />} />
              <Route path="conteudo/fatos-relevantes" element={<ConteudoFatosRelevantes />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </InvestorProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
