"use client";

import StaticIframe from "@/components/static-renderer/components/static-iframe";

export default function IframeExamplePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exemplo de Componente Iframe</h1>
          <p className="text-gray-600">Demonstração das diferentes configurações do componente StaticIframe</p>
        </div>

        <div className="grid gap-8">
          {/* Exemplo 1: YouTube Video */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">YouTube Video (16:9)</h2>
            <StaticIframe
              url="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube Video Example"
              aspectRatio="16:9"
              allowFullscreen={true}
              scrolling={false}
            />
          </div>

          {/* Exemplo 2: Google Maps */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Google Maps</h2>
            <StaticIframe
              url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975844898785!2d-46.65844092459602!3d-23.561573478786254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59541c6c79c3%3A0x36b90a85f0f8cb33!2sSão%20Paulo%2C%20SP!5e0!3m2!1spt!2sbr!4v1699888888888!5m2!1spt!2sbr"
              title="Google Maps - São Paulo"
              aspectRatio="4:3"
              height={400}
              allowFullscreen={true}
              scrolling={false}
            />
          </div>

          {/* Exemplo 3: Website Personalizado */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Website Personalizado (1:1)</h2>
            <StaticIframe
              url="https://example.com"
              title="Example Website"
              aspectRatio="1:1"
              width="50%"
              alignment="center"
              border={{
                width: 2,
                style: "solid",
                color: "#3b82f6",
                radius: {
                  topLeft: 12,
                  topRight: 12,
                  bottomRight: 12,
                  bottomLeft: 12,
                },
              }}
              backgroundColor="#f8fafc"
              padding={{ top: 20, right: 20, bottom: 20, left: 20 }}
            />
          </div>

          {/* Exemplo 4: Iframe com altura customizada */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Altura Customizada</h2>
            <StaticIframe
              url="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe"
              title="MDN Documentation"
              aspectRatio="custom"
              customAspectRatio="40%"
              width="100%"
              scrolling={true}
              sandbox="allow-same-origin allow-scripts allow-popups"
              border={{
                width: 1,
                style: "dashed",
                color: "#10b981",
                radius: {
                  topLeft: 8,
                  topRight: 8,
                  bottomRight: 8,
                  bottomLeft: 8,
                },
              }}
            />
          </div>

          {/* Exemplo 5: CodePen */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">CodePen Embed</h2>
            <StaticIframe
              url="https://codepen.io/team/codepen/embed/PNaGbb?default-tab=result"
              title="CodePen Example"
              aspectRatio="16:9"
              allowFullscreen={true}
              scrolling={false}
              alignment="center"
              margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
            />
          </div>
        </div>

        {/* Informações técnicas */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Recursos do Componente Iframe</h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Suporte a diferentes proporções de aspecto (16:9, 4:3, 1:1, customizado)</li>
            <li>Controle completo de dimensões (largura e altura)</li>
            <li>Alinhamento flexível (esquerda, centro, direita)</li>
            <li>Configuração de margens e padding</li>
            <li>Bordas customizáveis com raio e estilo</li>
            <li>Cor de fundo configurável</li>
            <li>Controles de segurança com sandbox</li>
            <li>Opções de tela cheia e rolagem</li>
            <li>Acessibilidade com título descritivo</li>
            <li>Animações suaves com Framer Motion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
