import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '개인정보처리방침 - Maison de Letter',
  description: 'Maison de Letter 개인정보처리방침',
}

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-bold text-[#F5E6D3] mb-8">개인정보처리방침</h1>

        <div className="prose prose-invert prose-sm max-w-none text-[#F5E6D3]/70 space-y-8">
          <p>
            티비디랩(이하 &quot;회사&quot;)은 개인정보보호법에 따라 이용자의 개인정보를 보호하고
            이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제1조 (수집하는 개인정보 항목)</h2>
            <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li><strong>필수 항목:</strong> 이메일 주소</li>
              <li><strong>선택 항목:</strong> 이름, 연락처, 결혼식 일시 및 장소, 웨딩 사진</li>
              <li><strong>결제 시:</strong> 결제 정보 (결제 대행사를 통해 처리)</li>
              <li><strong>자동 수집:</strong> 서비스 이용 기록, 접속 로그, IP 주소</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제2조 (개인정보의 수집 및 이용 목적)</h2>
            <p>회사는 수집한 개인정보를 다음의 목적으로 이용합니다:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>청첩장 서비스 제공 및 맞춤형 디자인 생성</li>
              <li>회원 가입 및 서비스 이용 관리</li>
              <li>결제 및 환불 처리</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
              <li>고객 문의 응대</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제3조 (개인정보의 보유 및 이용 기간)</h2>
            <p>회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 경우는 예외로 합니다:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li><strong>서비스 이용 기록:</strong> 서비스 종료 후 1년</li>
              <li><strong>전자상거래법에 따른 보관:</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                  <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제4조 (개인정보의 제3자 제공)</h2>
            <p>회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제5조 (개인정보 처리 위탁)</h2>
            <p>회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다:</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 pr-4 text-[#F5E6D3]">수탁업체</th>
                    <th className="text-left py-2 text-[#F5E6D3]">위탁 업무</th>
                  </tr>
                </thead>
                <tbody className="text-[#F5E6D3]/60">
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-4">Supabase Inc.</td>
                    <td className="py-2">데이터베이스 호스팅 및 인증 서비스</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-4">Vercel Inc.</td>
                    <td className="py-2">웹 서비스 호스팅</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 pr-4">OpenAI</td>
                    <td className="py-2">AI 기반 디자인 생성</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제6조 (이용자의 권리와 행사 방법)</h2>
            <p>이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
            <p className="mt-3">
              위 권리 행사는 이메일(sungman.cho@tbdlabs.team)을 통해 요청하실 수 있으며,
              회사는 지체 없이 조치하겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제7조 (개인정보의 파기)</h2>
            <p>
              회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체 없이 해당 개인정보를 파기합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li><strong>전자적 파일:</strong> 복구 및 재생이 불가능한 방법으로 영구 삭제</li>
              <li><strong>종이 문서:</strong> 분쇄기로 분쇄하거나 소각</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제8조 (개인정보 보호책임자)</h2>
            <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 관련 불만 처리를 위해 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:</p>
            <div className="mt-3 p-4 bg-white/5 rounded-lg">
              <p><strong>개인정보 보호책임자</strong></p>
              <p className="mt-2">이메일: sungman.cho@tbdlabs.team</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">제9조 (개인정보처리방침의 변경)</h2>
            <p>
              본 개인정보처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 수 있으며,
              변경 시 서비스 내 공지사항을 통해 고지할 것입니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#F5E6D3] mb-3">부칙</h2>
            <p>본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.</p>
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
