"use client";

import StaticBirthdayCarousel from "@/components/static-renderer/components/static-birthday-carousel";

export default function BirthdayCarouselExamplePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exemplo de Carrossel de Aniversários</h1>
          <p className="text-gray-600">Demonstração do componente StaticBirthdayCarousel com dados reais da API</p>
        </div>

        <div className="grid gap-8">
          {/* Exemplo 1: Dados Reais da API */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Aniversariantes de Hoje (API Real)</h2>
            <StaticBirthdayCarousel
              dataSource="today"
              useMockData={false}
              autoplay={true}
              interval={4000}
              showArrows={true}
              showDots={true}
              cardWidth={280}
              cardHeight={380}
              cardSpacing={16}
              backgroundColor="#f8fafc"
              accentColor="#8b5cf6"
            />
          </div>

          {/* Exemplo 2: Dados Mock para Demonstração */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Modo Demonstração (Dados Mock)</h2>
            <StaticBirthdayCarousel
              dataSource="today"
              useMockData={true}
              autoplay={true}
              interval={3000}
              showArrows={true}
              showDots={true}
              cardWidth={300}
              cardHeight={400}
              cardSpacing={20}
              backgroundColor="#ffffff"
              accentColor="#d345f8"
            />
          </div>

          {/* Exemplo 3: Carrossel Compacto */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Versão Compacta</h2>
            <StaticBirthdayCarousel
              dataSource="today"
              useMockData={true}
              autoplay={false}
              showArrows={true}
              showDots={false}
              cardWidth={250}
              cardHeight={320}
              cardSpacing={12}
              backgroundColor="#f1f5f9"
              accentColor="#06b6d4"
            />
          </div>

          {/* Exemplo 4: Estilo Minimalista */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Estilo Minimalista</h2>
            <StaticBirthdayCarousel
              dataSource="today"
              useMockData={true}
              autoplay={true}
              interval={6000}
              showArrows={false}
              showDots={true}
              cardWidth={320}
              cardHeight={420}
              cardSpacing={24}
              backgroundColor="#fafafa"
              accentColor="#f59e0b"
            />
          </div>

          {/* Exemplo 5: Teste de Estado Vazio */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Estado Vazio (para teste)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Este exemplo simula quando não há aniversariantes. Para ver o estado vazio real, conecte com a API e teste em um dia sem aniversários.
            </p>
            <div style={{ height: "200px" }}>
              {/* Aqui você pode renderizar o componente configurado para mostrar estado vazio */}
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-4">🎉</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum aniversário hoje!</h3>
                  <p className="text-gray-600">Não há colaboradores fazendo aniversário hoje.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações técnicas */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Recursos do Carrossel de Aniversários</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🔌 Integração com API</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Conecta ao endpoint `/today` do CollabsService</li>
                <li>Fallback automático para dados mock em caso de erro</li>
                <li>Estados de loading, erro e vazio bem definidos</li>
                <li>Transformação automática dos dados da API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🎨 Personalização Visual</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Cores de fundo e destaque customizáveis</li>
                <li>Dimensões de cartão configuráveis</li>
                <li>Espaçamento entre cartões ajustável</li>
                <li>Animações suaves com Framer Motion</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">⚡ Funcionalidades</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Autoplay configurável com intervalo customizável</li>
                <li>Navegação por setas e pontos indicadores</li>
                <li>Layout responsivo e adaptativo</li>
                <li>Suporte a avatars ou iniciais como fallback</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">📱 Responsividade</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Adapta automaticamente para diferentes tamanhos de tela</li>
                <li>Centraliza cartões quando há espaço suficiente</li>
                <li>Scroll horizontal em telas menores</li>
                <li>Controles de navegação aparecem quando necessário</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">🔧 Informações de Debug</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Endpoint utilizado:</strong> /collabs/birthdays/today
            </p>
            <p>
              <strong>Service:</strong> CollabsService.getTodayBirthdays()
            </p>
            <p>
              <strong>Fallback:</strong> Dados mock automáticos em caso de erro
            </p>
            <p>
              <strong>Formatação de data:</strong> DD/MM (extraído do campo birthday)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
