// Gemini API 키 확인 스크립트
require('dotenv').config({ path: '.env.local' });

const geminiApiKey = process.env.GEMINI_API_KEY;

console.log('🔍 Gemini API 키 확인 중...\n');

if (!geminiApiKey) {
  console.log('❌ GEMINI_API_KEY가 설정되지 않았습니다.');
  console.log('   .env.local 파일에 GEMINI_API_KEY=your_api_key 형식으로 추가해주세요.');
  process.exit(1);
}

if (geminiApiKey === 'your_gemini_api_key_here' || geminiApiKey.includes('your_')) {
  console.log('❌ GEMINI_API_KEY가 예시 값으로 설정되어 있습니다.');
  console.log('   실제 API 키로 변경해주세요.');
  process.exit(1);
}

// 키 형식 확인 (일반적으로 Gemini API 키는 AIza로 시작)
if (geminiApiKey.startsWith('AIza')) {
  console.log('✅ GEMINI_API_KEY가 올바른 형식으로 설정되어 있습니다.');
  console.log(`   키 길이: ${geminiApiKey.length}자`);
  console.log(`   키 시작: ${geminiApiKey.substring(0, 10)}...`);
  console.log('\n✅ 정상적으로 설정되었습니다!');
} else {
  console.log('⚠️  GEMINI_API_KEY 형식이 예상과 다릅니다.');
  console.log(`   키 길이: ${geminiApiKey.length}자`);
  console.log(`   키 시작: ${geminiApiKey.substring(0, 10)}...`);
  console.log('   일반적으로 Gemini API 키는 "AIza"로 시작합니다.');
  console.log('   하지만 다른 형식일 수도 있으니 API 키 발급 페이지를 확인해주세요.');
}

