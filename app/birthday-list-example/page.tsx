"use client";

import StaticBirthdayList from "@/components/static-renderer/components/static-birthday-list";

export default function BirthdayListExamplePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exemplo de Lista de Aniversários</h1>
          <p className="text-gray-600">Demonstração do componente StaticBirthdayList com múltiplos modos e configurações</p>
        </div>

        <div className="grid gap-8">
          {/* Exemplo 1: Lista com Dados Reais da API */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Lista Padrão - Dados Reais da API</h2>
            <StaticBirthdayList
              dataSource="today"
              useMockData={false}
              title="Aniversariantes de Hoje"
              displayMode="list"
              showDate={true}
              showDepartment={true}
              iconType="cake"
              accentColor="#8b5cf6"
              avatarSize={48}
              nameSize={16}
              dateSize={14}
              itemSpacing={16}
              maxHeight={400}
            />
          </div>

          {/* Exemplo 2: Grade Responsiva */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Modo Grade Responsiva</h2>
            <StaticBirthdayList
              dataSource="today"
              useMockData={true}
              title="Aniversariantes em Grade"
              displayMode="grid"
              gridColumns={3}
              showDate={true}
              showDepartment={false}
              iconType="gift"
              accentColor="#f59e0b"
              avatarSize={40}
              avatarShape="rounded"
              itemBackgroundColor="#fef3c7"
              itemBorderRadius={12}
              itemPadding={12}
              maxHeight={500}
            />
          </div>

          {/* Exemplo 3: Carrossel com Autoplay */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Carrossel com Autoplay</h2>
            <StaticBirthdayList
              dataSource="today"
              useMockData={true}
              title="Carrossel de Aniversários"
              displayMode="carousel"
              carouselAutoplay={true}
              carouselInterval={3000}
              carouselShowArrows={true}
              carouselShowDots={true}
              itemsPerPage={2}
              showDate={true}
              showDepartment={true}
              iconType="sparkles"
              accentColor="#06b6d4"
              avatarSize={56}
              avatarShape="circle"
              titleSize={20}
              nameSize={18}
              maxHeight={300}
            />
          </div>

          {/* Exemplo 4: Lista com Paginação */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Lista com Paginação</h2>
            <StaticBirthdayList
              dataSource="today"
              useMockData={true}
              title="Lista Paginada"
              displayMode="list"
              showPagination={true}
              itemsPerPage={2}
              showDate={true}
              showDepartment={true}
              iconType="calendar"
              accentColor="#dc2626"
              avatarSize={44}
              avatarShape="square"
              itemHoverEffect={true}
              itemBackgroundColor="#fef2f2"
              itemBorderWidth={1}
              itemBorderColor="#fecaca"
              itemBorderRadius={8}
              maxHeight={250}
            />
          </div>

          {/* Exemplo 5: Estilo Customizado */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Estilo Customizado</h2>
            <StaticBirthdayList
              dataSource="today"
              useMockData={true}
              title="Estilo Personalizado"
              displayMode="list"
              showDate={true}
              showDepartment={false}
              iconType="gift"
              backgroundColor="#1f2937"
              textColor="#f9fafb"
              titleColor="#fbbf24"
              accentColor="#f59e0b"
              borderColor="#374151"
              borderRadius={16}
              avatarSize={52}
              avatarShape="circle"
              initialsBackgroundColor="#f59e0b"
              initialsTextColor="#1f2937"
              titleSize={22}
              titleWeight="bold"
              nameSize={17}
              nameWeight="semibold"
              dateSize={15}
              dateWeight="medium"
              itemSpacing={20}
              maxHeight={350}
            />
          </div>

          {/* Exemplo 6: Estado Vazio */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Estado Vazio (Simulado)</h2>
            <div style={{ height: "200px" }}>
              <div className="flex flex-col items-center justify-center py-8 text-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="mb-4 opacity-30">🎂</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum aniversário hoje!</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Não há colaboradores fazendo aniversário hoje. Volte outro dia para ver as celebrações!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações técnicas */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Recursos da Lista de Aniversários Avançada</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🔌 Integração com API</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Conecta ao endpoint `/today` do CollabsService</li>
                <li>Fallback automático para dados mock</li>
                <li>Estados de loading e erro bem definidos</li>
                <li>Transformação automática dos dados</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">📱 Modos de Exibição</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Lista tradicional com scroll</li>
                <li>Grade responsiva configurável</li>
                <li>Carrossel com autoplay e controles</li>
                <li>Paginação para grandes listas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🎨 Personalização</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Tipografia totalmente customizável</li>
                <li>Formas de avatar (círculo, quadrado, arredondado)</li>
                <li>Cores de fundo, texto e destaque</li>
                <li>Espaçamentos e tamanhos ajustáveis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">⚡ Funcionalidades</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Responsividade automática</li>
                <li>Efeitos hover configuráveis</li>
                <li>Animações suaves</li>
                <li>Suporte a iniciais como fallback</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🛡️ Estados e Errors</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Loading state com spinner</li>
                <li>Error state com retry</li>
                <li>Empty state customizável</li>
                <li>Fallback transparente para mock data</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🔧 Controles</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Navegação por setas (carrossel)</li>
                <li>Pontos indicadores</li>
                <li>Paginação com números</li>
                <li>Breakpoints responsivos configuráveis</li>
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
            <p>
              <strong>Modos disponíveis:</strong> list, grid, carousel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
