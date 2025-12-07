import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '이용약관 - Maison de Letter',
  description: 'Maison de Letter 서비스 이용약관',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0A0806]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/">
            <Image src="/logo.png" alt="Maison de Letter" width={180} height={43} className="brightness-110 h-8 w-auto" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-[#F5E6D3] mb-8">이용약관</h1>

        <div className="prose prose-invert prose-sm max-w-none text-[#F5E6D3]/70 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제1조 (목적)</h2>
            <p>
              본 약관은 티비디랩(이하 &quot;회사&quot;)이 운영하는 Maison de Letter 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여
              회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제2조 (용어의 정의)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>&quot;서비스&quot;란 회사가 제공하는 모바일 청첩장 제작 및 관련 서비스를 말합니다.</li>
              <li>&quot;이용자&quot;란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.</li>
              <li>&quot;청첩장&quot;이란 이용자가 서비스를 통해 제작한 디지털 청첩장을 말합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제3조 (서비스의 제공)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>회사는 다음과 같은 서비스를 제공합니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>AI 기반 맞춤형 청첩장 디자인 생성</li>
                  <li>청첩장 편집 및 커스터마이징</li>
                  <li>청첩장 공유 및 배포</li>
                  <li>방명록 및 축의금 안내 기능</li>
                </ul>
              </li>
              <li>서비스는 연중무휴 24시간 제공을 원칙으로 합니다. 단, 시스템 점검 등 불가피한 경우 일시 중단될 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제4조 (결제 및 환불)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>서비스 이용 요금은 서비스 내 명시된 금액에 따릅니다.</li>
              <li>결제 완료 후 24시간 이내에 환불을 요청하신 경우, 전액 환불해 드립니다.</li>
              <li>24시간 이후 환불 요청 시, 이미 제공된 서비스의 이용 여부에 따라 부분 환불 또는 환불이 불가할 수 있습니다.</li>
              <li>청첩장 링크를 배포한 이후에는 환불이 제한될 수 있습니다.</li>
              <li>환불 문의: sungman.cho@tbdlabs.team</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제5조 (지적재산권)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>서비스 내 회사가 제공하는 디자인 템플릿, 소프트웨어, 콘텐츠의 저작권은 회사에 귀속됩니다.</li>
              <li>이용자가 업로드한 사진 및 텍스트의 저작권은 이용자에게 귀속됩니다.</li>
              <li>이용자는 서비스를 통해 제작한 청첩장을 개인적인 목적으로 자유롭게 사용할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제6조 (이용자의 의무)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>이용자는 다음 행위를 하여서는 안 됩니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>타인의 정보를 도용하는 행위</li>
                  <li>회사의 저작권 등 지적재산권을 침해하는 행위</li>
                  <li>서비스를 상업적으로 재판매하는 행위</li>
                  <li>기타 관련 법령에 위반되는 행위</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제7조 (면책조항)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
              <li>회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.</li>
              <li>회사는 이용자가 서비스를 통해 얻은 정보의 정확성, 신뢰성에 대해 보증하지 않습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제8조 (분쟁 해결)</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>본 약관과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 원만한 해결을 위해 성실히 협의합니다.</li>
              <li>협의가 이루어지지 않을 경우, 관할 법원은 민사소송법에 따른 법원으로 합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">부칙</h2>
            <p>본 약관은 2025년 1월 1일부터 시행됩니다.</p>
          </section>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] text-[#F5E6D3]/30">
            © 2025 Maison de Letter. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
