"use client";

import StaticBirthdayDisplay from "@/components/static-renderer/components/static-birthday-display";

export default function BirthdayDisplayExamplePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exemplo de Display de Aniversários Unificado</h1>
          <p className="text-gray-600">Demonstração do componente StaticBirthdayDisplay que combina lista e carrossel em um só componente</p>
        </div>

        <div className="grid gap-8">
          {/* Exemplo 1: Lista com Dados Reais da API */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Lista - Dados Reais da API</h2>
            <StaticBirthdayDisplay
              dataSource="today"
              useMockData={false}
              displayType="list"
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
              animation="fade"
              itemHoverEffect={true}
            />
          </div>

          {/* Exemplo 2: Grade Responsiva */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Modo Grade Responsiva</h2>
            <StaticBirthdayDisplay
              dataSource="today"
              useMockData={true}
              displayType="list"
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
              animation="slide"
            />
          </div>

          {/* Exemplo 3: Carrossel com Autoplay */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Carrossel com Autoplay</h2>
            <StaticBirthdayDisplay
              dataSource="today"
              useMockData={true}
              displayType="carousel"
              title="Carrossel de Aniversários"
              autoplay={true}
              interval={3000}
              showArrows={true}
              showDots={true}
              cardWidth={300}
              cardHeight={400}
              cardSpacing={20}
              iconType="sparkles"
              accentColor="#06b6d4"
              titleSize={20}
              cardBackgroundColor="#d345f8"
              cardShadow={true}
              animation="scale"
            />
          </div>

          {/* Exemplo 4: Lista com Paginação */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Lista com Paginação</h2>
            <StaticBirthdayDisplay
              dataSource="today"
              useMockData={true}
              displayType="list"
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
              animation="fade"
            />
          </div>

          {/* Exemplo 5: Carrossel Compacto */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Carrossel Compacto</h2>
            <StaticBirthdayDisplay
              dataSource="today"
              useMockData={true}
              displayType="carousel"
              title="Carrossel Compacto"
              autoplay={false}
              showArrows={true}
              showDots={false}
              cardWidth={250}
              cardHeight={350}
              cardSpacing={15}
              iconType="gift"
              accentColor="#8b5cf6"
              titleSize={18}
              cardBackgroundColor="#8b5cf6"
              cardBorderRadius={16}
              cardShadow={true}
              alignment="center"
            />
          </div>

          {/* Exemplo 6: Estilo Dark Theme */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-white">Tema Escuro - Lista</h2>
            <StaticBirthdayDisplay
              dataSource="today"
              useMockData={true}
              displayType="list"
              title="Aniversariantes - Tema Escuro"
              displayMode="list"
              showDate={true}
              showDepartment={true}
              iconType="cake"
              backgroundColor="#1f2937"
              textColor="#f9fafb"
              titleColor="#fbbf24"
              accentColor="#f59e0b"
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
              itemBackgroundColor="#374151"
              itemBorderRadius={12}
              itemPadding={16}
              animation="slide"
            />
          </div>

          {/* Exemplo 7: Estado Vazio Simulado */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Estado Vazio (Simulado)</h2>
            <div style={{ height: "300px" }}>
              <div className="flex flex-col items-center justify-center py-16 text-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-sm bg-red-100">🎂</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum aniversário hoje!</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Não há colaboradores fazendo aniversário hoje. O componente automaticamente exibe este estado quando não há dados.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações técnicas do componente unificado */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🚀 Recursos do Display de Aniversários Unificado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🔄 Dois Modos em Um</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Modo Lista: vertical, grade, paginação</li>
                <li>Modo Carrossel: horizontal com cards</li>
                <li>Switching dinâmico entre modos</li>
                <li>Configurações específicas por modo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🔌 Integração Avançada</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>API real com CollabsService</li>
                <li>Fallback inteligente para mock data</li>
                <li>Estados de loading, erro e vazio</li>
                <li>Retry automático em caso de erro</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🎨 Personalização Total</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Tipografia completa (tamanhos, pesos)</li>
                <li>Formas de avatar configuráveis</li>
                <li>Cores e temas (incluindo dark mode)</li>
                <li>Espaçamentos e dimensões ajustáveis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">📱 Responsividade</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Breakpoints configuráveis</li>
                <li>Adaptação automática de colunas</li>
                <li>Mobile-first design</li>
                <li>Touch-friendly navigation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">✨ Animações e UX</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Animações de entrada (fade, slide, scale)</li>
                <li>Hover effects configuráveis</li>
                <li>Transições suaves</li>
                <li>Loading states elegantes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🛠️ Controles Avançados</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Carrossel: autoplay, setas, dots</li>
                <li>Lista: paginação, grid responsivo</li>
                <li>Empty states customizáveis</li>
                <li>Indicadores de fonte de dados</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparação entre modos */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-4">📊 Comparação: Lista vs Carrossel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3">📋 Modo Lista</h4>
              <div className="space-y-2 text-green-700 text-sm">
                <p>
                  <strong>Melhor para:</strong> Muitos itens, informações detalhadas
                </p>
                <p>
                  <strong>Layouts:</strong> Lista vertical, grade responsiva
                </p>
                <p>
                  <strong>Funcionalidades:</strong> Paginação, scroll, filtros
                </p>
                <p>
                  <strong>Informações:</strong> Nome, data, departamento, avatar
                </p>
                <p>
                  <strong>Customização:</strong> Tipografia, cores, espaçamentos
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-3">🎠 Modo Carrossel</h4>
              <div className="space-y-2 text-green-700 text-sm">
                <p>
                  <strong>Melhor para:</strong> Destaque visual, poucos itens
                </p>
                <p>
                  <strong>Layouts:</strong> Cards horizontais, navegação
                </p>
                <p>
                  <strong>Funcionalidades:</strong> Autoplay, setas, indicadores
                </p>
                <p>
                  <strong>Informações:</strong> Cards visuais com foto e detalhes
                </p>
                <p>
                  <strong>Customização:</strong> Tamanhos, cores, sombras
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">🔧 Informações Técnicas</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Componente:</strong> StaticBirthdayDisplay
            </p>
            <p>
              <strong>Endpoint:</strong> /collabs/birthdays/today (CollabsService)
            </p>
            <p>
              <strong>Fallback:</strong> Dados mock automáticos em caso de erro
            </p>
            <p>
              <strong>Tipos suportados:</strong> list (com sub-modos list/grid) e carousel
            </p>
            <p>
              <strong>Animações:</strong> fade, slide, scale, none
            </p>
            <p>
              <strong>Responsividade:</strong> sm (640px), md (768px), lg (1024px)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
