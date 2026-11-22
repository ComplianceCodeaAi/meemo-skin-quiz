import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#0a0a0a", surface: "#111111", border: "#1e1e1e",
  amber: "#e8920a", text: "#f0ece6", textMuted: "#9a928a", textDim: "#5a5450",
  mono: "'IBM Plex Mono', 'Courier New', monospace",
  sans: "'IBM Plex Sans', sans-serif",
};

const T = {
  en: {
    brand: "MEEMO", sub: "SKIN_ANALYSIS",
    headline1: "Korean Innovation", headline2: "for Skin + Scalp.",
    subtitle: "Korean skin and scalp innovation, matched to you. Precise. Proven. Personal.",
    terminal: "skin_analysis --your-way",
    begin: "start — at your own pace →",
    version: "MEEMO / SKIN_DIAGNOSTICS v2.5",
    yourPace: "YOUR PACE", yourPaceDesc: "Go deep or keep it simple",
    skinScalp: "SKIN + SCALP", skinScalpDesc: "Face and scalp, covered",
    koreanInno: "KOREAN INNOVATION", koreanInnoDesc: "Fermentation, peptides, Cica, Snail",
    bestPrice: "BEST PRICE", bestPriceDesc: "Amazon, Jolse, YesStyle + more",
    analysisComplete: "ANALYSIS COMPLETE ──",
    yourRegime: "Your Korean Beauty Regime",
    processing: "PROCESSING",
    scanComplete: "SKIN SCAN ANALYSIS ──",
    saveProfile: "SAVE TO MEEMO PROFILE ──",
    saveDesc: "Save your regime. We'll remember your skin type and routine for next time.",
    saveName: "Your name", saveEmail: "Email address", saveBtn: "save my skin profile →",
    textRegime: "TEXT MY REGIME ──",
    textDesc: "Opens your SMS app with your protocol pre-filled.",
    textPhone: "+1 555 000 0000", textSend: "send →",
    copyLabel: "COPY", emailLabel: "EMAIL",
    restart: "↺ restart analysis",
    back: "← back", continueBtn: "continue →", runAnalysis: "run full analysis →",
    stepNote: "ADD A NOTE", noteOptional: "— optional",
    notePlaceholder: "Allergies, products tried, doctor notes, specific concerns…",
    noteSaved: "✓ note saved",
    selectAll: "Select all that apply.",
    basedOn: "BASED ON YOUR INPUTS ──",
    estimatedCost: "ESTIMATED FULL ROUTINE COST",
    firstPick: "FIRST PICK ──", secondPick: "SECOND PICK ──",
    firstChoice: "FIRST CHOICE", whyRec: "WHY THIS WAS RECOMMENDED",
    skinSection: "SKIN PROFILE", profileSection: "PROFILE", lifestyleSection: "LIFESTYLE",
    savePlusShare: "SAVE + SHARE ──",
    footerLeft: "MEEMO WELLNESS AI", footerRight: "KOREAN BEAUTY SKIN INTELLIGENCE v2.5",
    selfieTitle: "Optional: Scan your skin",
    selfieDesc: "Upload a selfie for AI-powered visual skin analysis. We analyze visible redness, oiliness, texture, pores, and tone — layered on top of your quiz answers.",
    selfieReady: "Photo ready — AI will analyze your skin",
    selfieChange: "Tap to change",
    selfieUpload: "Tap to upload a selfie",
    selfieFormat: "JPG or PNG · Front-facing, good lighting",
    selfiePrivacy: "Your photo is sent directly to Claude AI and never stored. Analysis happens in real time and is deleted immediately after.",
    selfieAnalyze: "analyze my skin →",
    selfieSkip: "skip — use quiz answers only →",
    scanHeader: "SKIN SCAN ANALYSIS ──",
    scanFactored: "✓ Visual observations factored into your regime below",
    scalpSection: "SCALP PROFILE",
    secSkin: "SKIN", secScalp: "SCALP", secProfile: "PROFILE", secLifestyle: "LIFESTYLE",
    skip: "skip this question →",
    continueHint: "select an option or add a note to continue — or skip this question",
    skinRoutine: "SKIN ROUTINE —— Apply to face AM/PM",
    scalpRoutine: "SCALP ROUTINE —— Apply on wash days",
    textPreview: "TEXT PREVIEW — tap to select all",
    fallbackNote: "Showing curated recommendations — personalized analysis is temporarily unavailable, so these are our editors' picks.",
    legalTitle: "IMPORTANT INFORMATION ──",
    recsExplainer: "Each product below shows its price range, best retailer, and a › button explaining exactly which of your inputs triggered it.",
    legalBody: "Meemo provides cosmetic guidance only. This analysis is not medical advice and does not diagnose or treat any skin, scalp, or medical condition. For persistent or serious concerns — including psoriasis, dermatitis, or hair loss — please consult a dermatologist. Product ratings and prices are indicative and may differ at the retailer. Meemo may earn a commission from retailer links, at no extra cost to you. Privacy: your answers are used only to generate your routine. A selfie, if you add one, is sent to Claude AI (Anthropic) for analysis and is never stored by Meemo. Saving a profile stores your details only in this browser — nothing is uploaded to a Meemo server.",
  },
  es: {
    brand: "MEEMO", sub: "ANÁLISIS DE PIEL",
    headline1: "Innovación Coreana", headline2: "para Piel + Cuero Cabelludo.",
    subtitle: "Innovación coreana para piel y cuero cabelludo, adaptada a ti. Precisa. Probada. Personal.",
    terminal: "analisis_piel --a-tu-ritmo",
    begin: "comenzar — a tu propio ritmo →",
    version: "MEEMO / DIAGNÓSTICO DE PIEL v2.5",
    yourPace: "TU RITMO", yourPaceDesc: "Profundo o simple, tú decides",
    skinScalp: "PIEL + CUERO", skinScalpDesc: "Cara y cuero cabelludo",
    koreanInno: "INNOVACIÓN COREANA", koreanInnoDesc: "Fermentación, péptidos, Cica",
    bestPrice: "MEJOR PRECIO", bestPriceDesc: "Amazon, Jolse, YesStyle + más",
    analysisComplete: "ANÁLISIS COMPLETO ──",
    yourRegime: "Tu Régimen de Belleza Coreana",
    processing: "PROCESANDO",
    scanComplete: "ANÁLISIS DE PIEL ──",
    saveProfile: "GUARDAR EN MEEMO ──",
    saveDesc: "Guarda tu régimen. Recordaremos tu tipo de piel para la próxima vez.",
    saveName: "Tu nombre", saveEmail: "Correo electrónico", saveBtn: "guardar mi perfil →",
    textRegime: "ENVIAR MI RÉGIMEN ──",
    textDesc: "Abre tu app de mensajes con el protocolo listo.",
    textPhone: "+1 555 000 0000", textSend: "enviar →",
    copyLabel: "COPIAR", emailLabel: "EMAIL",
    restart: "↺ reiniciar análisis",
    back: "← volver", continueBtn: "continuar →", runAnalysis: "ejecutar análisis completo →",
    stepNote: "AGREGAR NOTA", noteOptional: "— opcional",
    notePlaceholder: "Alergias, productos probados, notas médicas, preocupaciones específicas…",
    noteSaved: "✓ nota guardada",
    selectAll: "Selecciona todas las que apliquen.",
    basedOn: "BASADO EN TUS RESPUESTAS ──",
    estimatedCost: "COSTO ESTIMADO DEL RÉGIMEN",
    firstPick: "PRIMERA OPCIÓN ──", secondPick: "SEGUNDA OPCIÓN ──",
    firstChoice: "PRIMERA OPCIÓN", whyRec: "POR QUÉ SE RECOMENDÓ",
    skinSection: "PERFIL DE PIEL", profileSection: "PERFIL", lifestyleSection: "ESTILO DE VIDA",
    savePlusShare: "GUARDAR + COMPARTIR ──",
    footerLeft: "MEEMO WELLNESS AI", footerRight: "INTELIGENCIA DE BELLEZA COREANA v2.5",
    selfieTitle: "Opcional: Escanea tu piel",
    selfieDesc: "Sube una selfie para análisis visual de piel con IA. Analizamos rojez, brillo, textura, poros y tono — junto con tus respuestas.",
    selfieReady: "Foto lista — la IA analizará tu piel",
    selfieChange: "Toca para cambiar",
    selfieUpload: "Toca para subir una selfie",
    selfieFormat: "JPG o PNG · Frente a la cámara, buena iluminación",
    selfiePrivacy: "Tu foto se envía directamente a la IA y nunca se almacena.",
    selfieAnalyze: "analizar mi piel →",
    selfieSkip: "omitir — usar solo respuestas →",
    scanHeader: "ANÁLISIS DE PIEL ──",
    scanFactored: "✓ Observaciones visuales incluidas en tu régimen",
    scalpSection: "PERFIL DEL CUERO CABELLUDO",
    secSkin: "PIEL", secScalp: "CUERO CABELLUDO", secProfile: "PERFIL", secLifestyle: "ESTILO DE VIDA",
    skip: "omitir esta pregunta →",
    continueHint: "selecciona una opción o agrega una nota para continuar — o omite esta pregunta",
    skinRoutine: "RUTINA DE PIEL —— Aplicar en el rostro AM/PM",
    scalpRoutine: "RUTINA DEL CUERO CABELLUDO —— Aplicar en días de lavado",
    textPreview: "VISTA PREVIA — toca para seleccionar todo",
    fallbackNote: "Mostrando recomendaciones seleccionadas — el análisis personalizado no está disponible temporalmente, así que estas son las elecciones de nuestros editores.",
    legalTitle: "INFORMACIÓN IMPORTANTE ──",
    recsExplainer: "Cada producto muestra su rango de precios, la mejor tienda y un botón › que explica exactamente qué respuestas lo motivaron.",
    legalBody: "Meemo ofrece solo orientación cosmética. Este análisis no es consejo médico y no diagnostica ni trata ninguna afección de la piel, el cuero cabelludo o de salud. Ante problemas persistentes o graves —incluidos psoriasis, dermatitis o caída del cabello— consulta a un dermatólogo. Las valoraciones y los precios son orientativos y pueden variar en la tienda. Meemo puede recibir una comisión por los enlaces a tiendas, sin costo adicional para ti. Privacidad: tus respuestas se usan solo para generar tu rutina. Si agregas una selfie, se envía a Claude AI (Anthropic) para su análisis y Meemo nunca la almacena. Guardar un perfil almacena tus datos solo en este navegador: nada se sube a un servidor de Meemo.",
  },
  pt: {
    brand: "MEEMO", sub: "ANÁLISE DE PELE",
    headline1: "Inovação Coreana", headline2: "para Pele + Couro Cabeludo.",
    subtitle: "Inovação coreana para pele e couro cabeludo, personalizada para você. Precisa. Comprovada. Pessoal.",
    terminal: "analise_pele --no-seu-ritmo",
    begin: "começar — no seu ritmo →",
    version: "MEEMO / DIAGNÓSTICO DE PELE v2.5",
    yourPace: "SEU RITMO", yourPaceDesc: "Profundo ou simples, você decide",
    skinScalp: "PELE + COURO", skinScalpDesc: "Rosto e couro cabeludo",
    koreanInno: "INOVAÇÃO COREANA", koreanInnoDesc: "Fermentação, peptídeos, Cica",
    bestPrice: "MELHOR PREÇO", bestPriceDesc: "Amazon, Jolse, YesStyle + mais",
    analysisComplete: "ANÁLISE COMPLETA ──",
    yourRegime: "Seu Regime de Beleza Coreana",
    processing: "PROCESSANDO",
    saveProfile: "SALVAR NO MEEMO ──",
    saveDesc: "Salve seu regime. Lembraremos do seu tipo de pele.",
    saveName: "Seu nome", saveEmail: "E-mail", saveBtn: "salvar meu perfil →",
    textRegime: "ENVIAR MEU REGIME ──",
    textDesc: "Abre seu app de mensagens com o protocolo pronto.",
    textPhone: "+55 11 00000-0000", textSend: "enviar →",
    copyLabel: "COPIAR", emailLabel: "EMAIL",
    restart: "↺ reiniciar análise",
    back: "← voltar", continueBtn: "continuar →", runAnalysis: "executar análise completa →",
    stepNote: "ADICIONAR NOTA", noteOptional: "— opcional",
    notePlaceholder: "Alergias, produtos testados, notas médicas…",
    noteSaved: "✓ nota salva",
    selectAll: "Selecione todas que se aplicam.",
    basedOn: "BASEADO NAS SUAS RESPOSTAS ──",
    estimatedCost: "CUSTO ESTIMADO DO REGIME",
    firstPick: "PRIMEIRA ESCOLHA ──", secondPick: "SEGUNDA ESCOLHA ──",
    firstChoice: "PRIMEIRA ESCOLHA", whyRec: "POR QUE FOI RECOMENDADO",
    skinSection: "PERFIL DE PELE", profileSection: "PERFIL", lifestyleSection: "ESTILO DE VIDA",
    savePlusShare: "SALVAR + COMPARTILHAR ──",
    footerLeft: "MEEMO WELLNESS AI", footerRight: "BELEZA COREANA INTELIGENTE v2.5",
    selfieTitle: "Opcional: Escaneie sua pele",
    selfieDesc: "Envie uma selfie para análise visual com IA. Analisamos vermelhidão, oleosidade, textura, poros e tom.",
    selfieReady: "Foto pronta — a IA vai analisar sua pele",
    selfieChange: "Toque para trocar",
    selfieUpload: "Toque para enviar uma selfie",
    selfieFormat: "JPG ou PNG · Frente à câmera, boa iluminação",
    selfiePrivacy: "Sua foto é enviada diretamente à IA e nunca armazenada.",
    selfieAnalyze: "analisar minha pele →",
    selfieSkip: "pular — usar apenas respostas →",
    scanHeader: "ANÁLISE DE PELE ──",
    scanFactored: "✓ Observações visuais incluídas no seu regime",
    scalpSection: "PERFIL DO COURO CABELUDO",
    secSkin: "PELE", secScalp: "COURO CABELUDO", secProfile: "PERFIL", secLifestyle: "ESTILO DE VIDA",
    skip: "pular esta pergunta →",
    continueHint: "selecione uma opção ou adicione uma nota para continuar — ou pule esta pergunta",
    skinRoutine: "ROTINA DE PELE —— Aplicar no rosto AM/PM",
    scalpRoutine: "ROTINA DO COURO CABELUDO —— Aplicar nos dias de lavagem",
    textPreview: "PRÉ-VISUALIZAÇÃO — toque para selecionar tudo",
    fallbackNote: "Mostrando recomendações selecionadas — a análise personalizada está temporariamente indisponível, então estas são as escolhas dos nossos editores.",
    legalTitle: "INFORMAÇÕES IMPORTANTES ──",
    recsExplainer: "Cada produto abaixo mostra sua faixa de preço, a melhor loja e um botão › explicando exatamente quais respostas o motivaram.",
    legalBody: "A Meemo oferece apenas orientação cosmética. Esta análise não é aconselhamento médico e não diagnostica nem trata qualquer condição de pele, couro cabeludo ou de saúde. Para preocupações persistentes ou graves — incluindo psoríase, dermatite ou queda de cabelo — consulte um dermatologista. Avaliações e preços são indicativos e podem diferir na loja. A Meemo pode receber uma comissão por links de lojas, sem custo extra para você. Privacidade: suas respostas são usadas apenas para gerar sua rotina. Uma selfie, se adicionada, é enviada à Claude AI (Anthropic) para análise e nunca é armazenada pela Meemo. Salvar um perfil guarda seus dados apenas neste navegador — nada é enviado a um servidor da Meemo.",
  },
  ko: {
    brand: "MEEMO", sub: "피부 분석",
    headline1: "한국의 혁신", headline2: "피부와 두피를 위해.",
    subtitle: "당신에게 맞춘 한국 피부·두피 혁신. 정확하고. 검증되었으며. 개인적입니다.",
    terminal: "피부_분석 --나만의_방식",
    begin: "나만의 속도로 시작하기 →",
    version: "MEEMO / 피부 진단 v2.5",
    yourPace: "나만의 속도", yourPaceDesc: "깊게 또는 간단하게",
    skinScalp: "피부 + 두피", skinScalpDesc: "얼굴과 두피 모두 케어",
    koreanInno: "한국 혁신", koreanInnoDesc: "발효, 펩타이드, 시카",
    bestPrice: "최저가", bestPriceDesc: "아마존, 올리브영 + 더보기",
    analysisComplete: "분석 완료 ──",
    yourRegime: "나만의 한국 뷰티 루틴",
    processing: "처리 중",
    saveProfile: "MEEMO 프로필 저장 ──",
    saveDesc: "루틴을 저장하세요. 다음 방문 시 피부 타입을 기억합니다.",
    saveName: "이름", saveEmail: "이메일 주소", saveBtn: "내 피부 프로필 저장 →",
    textRegime: "루틴 문자 전송 ──",
    textDesc: "프로토콜이 입력된 문자 앱을 엽니다.",
    textPhone: "010-0000-0000", textSend: "전송 →",
    copyLabel: "복사", emailLabel: "이메일",
    restart: "↺ 다시 분석하기",
    back: "← 이전", continueBtn: "계속 →", runAnalysis: "전체 분석 실행 →",
    stepNote: "메모 추가", noteOptional: "— 선택사항",
    notePlaceholder: "알레르기, 사용 제품, 의사 메모, 특별한 고민…",
    noteSaved: "✓ 메모 저장됨",
    selectAll: "해당하는 것을 모두 선택하세요.",
    basedOn: "입력 정보 기반 ──",
    estimatedCost: "예상 루틴 비용",
    firstPick: "첫 번째 추천 ──", secondPick: "두 번째 추천 ──",
    firstChoice: "첫 번째 추천", whyRec: "이 제품을 추천한 이유",
    skinSection: "피부 프로필", profileSection: "프로필", lifestyleSection: "라이프스타일",
    savePlusShare: "저장 + 공유 ──",
    footerLeft: "MEEMO WELLNESS AI", footerRight: "한국 뷰티 피부 지능 v2.5",
    selfieTitle: "선택사항: 피부 스캔",
    selfieDesc: "셀카를 업로드하면 AI가 피부를 분석합니다. 홍조, 유분, 모공, 톤을 분석합니다.",
    selfieReady: "사진 준비 완료 — AI가 피부를 분석합니다",
    selfieChange: "탭하여 변경",
    selfieUpload: "탭하여 셀카 업로드",
    selfieFormat: "JPG 또는 PNG · 정면, 밝은 조명",
    selfiePrivacy: "사진은 AI로 직접 전송되며 저장되지 않습니다.",
    selfieAnalyze: "피부 분석하기 →",
    selfieSkip: "건너뛰기 — 설문 답변만 사용 →",
    scanHeader: "피부 스캔 분석 ──",
    scanFactored: "✓ 시각적 분석이 루틴에 반영되었습니다",
    scalpSection: "두피 프로필",
    secSkin: "피부", secScalp: "두피", secProfile: "프로필", secLifestyle: "라이프스타일",
    skip: "이 질문 건너뛰기 →",
    continueHint: "계속하려면 옵션을 선택하거나 메모를 추가하세요 — 또는 이 질문을 건너뛰세요",
    skinRoutine: "피부 루틴 —— 아침/저녁 얼굴에 사용",
    scalpRoutine: "두피 루틴 —— 머리를 감는 날 사용",
    textPreview: "텍스트 미리보기 — 탭하여 전체 선택",
    fallbackNote: "큐레이션 추천을 표시 중입니다 — 맞춤 분석을 일시적으로 사용할 수 없어 에디터 추천 제품을 보여드립니다.",
    legalTitle: "중요 안내 ──",
    recsExplainer: "아래 각 제품에는 가격대, 최적의 구매처, 그리고 어떤 입력이 이 제품을 추천하게 했는지 설명하는 › 버튼이 있습니다.",
    legalBody: "Meemo는 화장품 관련 안내만 제공합니다. 이 분석은 의학적 조언이 아니며 피부, 두피 또는 기타 질환을 진단하거나 치료하지 않습니다. 건선, 피부염, 탈모 등 지속적이거나 심각한 문제가 있다면 피부과 전문의와 상담하세요. 제품 평점과 가격은 참고용이며 판매처에 따라 다를 수 있습니다. Meemo는 판매처 링크를 통해 수수료를 받을 수 있으며, 이용자에게 추가 비용은 없습니다. 개인정보: 답변은 루틴 생성에만 사용됩니다. 셀카를 추가하면 분석을 위해 Claude AI(Anthropic)로 전송되며 Meemo에 저장되지 않습니다. 프로필 저장은 이 브라우저에만 정보를 저장하며, Meemo 서버로 업로드되지 않습니다.",
  },
  zh: {
    brand: "MEEMO", sub: "肌肤分析",
    headline1: "韩国创新科技", headline2: "为肌肤与头皮而生。",
    subtitle: "专为您定制的韩国肌肤与头皮创新科技。精准。经过验证。个人化。",
    terminal: "肌肤分析 --按您的节奏",
    begin: "按自己的节奏开始 →",
    version: "MEEMO / 肌肤诊断 v2.5",
    yourPace: "您的节奏", yourPaceDesc: "深入或简单，由您决定",
    skinScalp: "肌肤 + 头皮", skinScalpDesc: "面部与头皮全面护理",
    koreanInno: "韩国创新", koreanInnoDesc: "发酵、肽、积雪草",
    bestPrice: "最低价格", bestPriceDesc: "亚马逊、Jolse、YesStyle + 更多",
    analysisComplete: "分析完成 ──",
    yourRegime: "您的韩式美容护理方案",
    processing: "处理中",
    saveProfile: "保存到 MEEMO 档案 ──",
    saveDesc: "保存您的护理方案。下次记住您的肤质。",
    saveName: "您的姓名", saveEmail: "电子邮件", saveBtn: "保存我的肌肤档案 →",
    textRegime: "发送我的方案 ──",
    textDesc: "打开短信应用，方案已预填写。",
    textPhone: "+86 000 0000 0000", textSend: "发送 →",
    copyLabel: "复制", emailLabel: "邮件",
    restart: "↺ 重新分析",
    back: "← 返回", continueBtn: "继续 →", runAnalysis: "运行完整分析 →",
    stepNote: "添加备注", noteOptional: "— 可选",
    notePlaceholder: "过敏史、已用产品、医生建议、特定问题…",
    noteSaved: "✓ 备注已保存",
    selectAll: "选择所有适用项。",
    basedOn: "基于您的输入 ──",
    estimatedCost: "预计护理方案费用",
    firstPick: "首选推荐 ──", secondPick: "次选推荐 ──",
    firstChoice: "首选推荐", whyRec: "推荐原因",
    skinSection: "肌肤档案", profileSection: "个人档案", lifestyleSection: "生活方式",
    savePlusShare: "保存 + 分享 ──",
    footerLeft: "MEEMO WELLNESS AI", footerRight: "韩国美容肌肤智能 v2.5",
    selfieTitle: "可选：扫描您的肌肤",
    selfieDesc: "上传自拍照，进行AI驱动的视觉肌肤分析。分析红肿、油脂、纹理、毛孔和肤色。",
    selfieReady: "照片已就绪 — AI将分析您的肌肤",
    selfieChange: "点击更换",
    selfieUpload: "点击上传自拍照",
    selfieFormat: "JPG或PNG · 正面拍摄，光线充足",
    selfiePrivacy: "您的照片直接发送给AI，不会被存储。",
    selfieAnalyze: "分析我的肌肤 →",
    selfieSkip: "跳过 — 仅使用问卷答案 →",
    scanHeader: "肌肤扫描分析 ──",
    scanFactored: "✓ 视觉观察已纳入您的护理方案",
    scalpSection: "头皮档案",
    secSkin: "肌肤", secScalp: "头皮", secProfile: "个人档案", secLifestyle: "生活方式",
    skip: "跳过此题 →",
    continueHint: "选择一个选项或添加备注以继续 — 或跳过此题",
    skinRoutine: "肌肤护理 —— 早晚用于面部",
    scalpRoutine: "头皮护理 —— 洗发日使用",
    textPreview: "文本预览 — 点击全选",
    fallbackNote: "正在显示精选推荐 — 个性化分析暂时不可用，以下为我们的编辑精选。",
    legalTitle: "重要信息 ──",
    recsExplainer: "下方每个产品都显示价格范围、最佳零售商，以及一个 › 按钮，说明您的哪些输入触发了该推荐。",
    legalBody: "Meemo 仅提供美容方面的指导。本分析不构成医疗建议，也不诊断或治疗任何肌肤、头皮或健康问题。如有持续或严重的问题——包括银屑病、皮炎或脱发——请咨询皮肤科医生。产品评分和价格仅供参考，零售商处可能有所不同。Meemo 可能通过零售商链接获得佣金，您无需支付额外费用。隐私：您的回答仅用于生成您的护理方案。如您添加自拍照，它将被发送至 Claude AI(Anthropic)进行分析，Meemo 绝不会存储。保存档案仅将您的信息存储在此浏览器中——不会上传到 Meemo 服务器。",
  },
};

const sectionColors = { SKIN: "#e8920a", PROFILE: "#4ecdc4", LIFESTYLE: "#a29bfe", SCALP: "#f78fb3" };
const catColor = { BARRIER: "#4ecdc4", BRIGHTEN: "#e8920a", HYDRATE: "#74b9ff", REPAIR: "#a29bfe", PROTECT: "#55efc4" };
const urgencyStyle = {
  ESSENTIAL: { color: "#e8920a", bg: "rgba(232,146,10,0.08)", border: "rgba(232,146,10,0.35)" },
  RECOMMENDED: { color: "#4ecdc4", bg: "rgba(78,205,196,0.08)", border: "rgba(78,205,196,0.35)" },
  BOOST: { color: "#a29bfe", bg: "rgba(162,155,254,0.08)", border: "rgba(162,155,254,0.35)" },
};
const retailerColor = { Amazon: "#ff9900", YesStyle: "#e94b6e", "Soko Glam": "#7b68ee", iHerb: "#5aac44", "Beauty of Joseon": "#c9a96e", StyleKorean: "#00b0c8", Stylevana: "#ff6b9d", "Olive Young": "#4ecdc4", "Peach & Lily": "#f78fb3", Target: "#cc0000", Ulta: "#7b2d8b", "Nudie Glow": "#f9ca24" };

function getRetailerURL(retailer, name, brand, directUrl) {
  if (directUrl) return directUrl;
  const q = encodeURIComponent(`${name} ${brand}`);
  const n = encodeURIComponent(name);
  const map = {
    "Amazon": `https://www.amazon.com/s?k=${q}`,
    "YesStyle": `https://www.yesstyle.com/en/search.html#/keyword=${n}&hl=en`,
    "iHerb": `https://www.iherb.com/search?kw=${q}`,
    "Soko Glam": `https://sokoglam.com/search?q=${n}`,
    "StyleKorean": `https://www.stylekorean.com/search?search=${n}`,
    "Stylevana": `https://www.stylevana.com/en_US/search?q=${n}`,
    "Olive Young": `https://www.oliveyoung.com/search?query=${n}`,
    "Jolse": `https://www.jolse.com/search?search=${q}`,
    "Peach & Lily": `https://www.peachandlily.com/search?q=${n}`,
    "Target": `https://www.target.com/s?searchTerm=${q}`,
    "Ulta": `https://www.ulta.com/search?search=${q}`,
    "Nudie Glow": `https://nudieglow.com/search?q=${n}`,
    "COSRX": `https://www.cosrx.com/search?q=${n}`,
    "Dr. Jart+": `https://www.drjart.com/search?q=${n}`,
  };
  return map[retailer] || `https://www.google.com/search?q=${encodeURIComponent(name + " " + brand + " buy")}`;
}

const STEP_ORDER = { "oil cleanser":1,"balm cleanser":1,"cleansing oil":1,"foam cleanser":2,"gel cleanser":2,"cleanser":2,"exfoliating toner":3,"essence toner":3,"toner":3,"serum ampoule":4,"ampoule":4,"lightweight serum":4,"serum":4,"essence":4,"sheet mask":5,"sleeping mask":5,"mask":5,"eye cream":6,"water-jelly cream":7,"gel cream":7,"moisturizer":7,"cream":7,"emulsion":7,"color-correcting cream":8,"sunscreen":9,"spf cream":9,"scalp serum":4,"scalp treatment":4,"scalp toner":3 };
function stepOrder(tex=""){ const t=tex.toLowerCase(); for(const[k,v]of Object.entries(STEP_ORDER))if(t.includes(k))return v; return 6; }
function stepCategory(tex=""){ const t=tex.toLowerCase();
  if(t.includes("scalp"))return"SCALP TREAT";
  if(t.includes("spf")||t.includes("sun")||t.includes("color-correct"))return"PROTECT";
  if(t.includes("cleanser")||t.includes("cleansing")||t.includes("foam"))return"CLEANSE";
  if(t.includes("toner")||t.includes("exfoliat"))return"TONE";
  if(t.includes("ampoule")||t.includes("serum")||t.includes("essence"))return"TREAT";
  if(t.includes("mask"))return"MASK";
  if(t.includes("eye"))return"EYE CREAM";
  if(t.includes("cream")||t.includes("moistur")||t.includes("emulsion")||t.includes("jelly"))return"MOISTURIZE";
  return"APPLY"; }
function stepLabel(tex=""){ const c=stepCategory(tex);
  const n={"CLEANSE":1,"TONE":2,"TREAT":3,"MASK":4,"EYE CREAM":4,"MOISTURIZE":4,"PROTECT":5,"SCALP TREAT":3}[c];
  return n?`STEP ${n} · ${c}`:`STEP · ${c}`; }

const DEMO_RECS = [
  {name:"Low pH Good Morning Cleanser",brand:"COSRX",tech:"pH-Balanced Surfactant System",ingredient:"Tea Tree Oil",texture:"gel cleanser",why:"Gentle pH-balanced gel that cleanses thoroughly without stripping or tightness.",category:"REPAIR",urgency:"ESSENTIAL",timing:"AM + PM",price:"$11–$14",retailer:"Amazon",url:"https://www.amazon.com/dp/B016NRXO06",rating:"4.7",ratingCount:"89k+",altName:"Green Tea Amino Hydrating Cleansing Foam",altBrand:"Innisfree",altPrice:"$13–$16",altRetailer:"YesStyle",altUrl:"https://www.yesstyle.com/en/innisfree-green-tea-amino-hydrating-cleansing-foam-150g/info.html/pid.1120887593",altRating:"4.5",altWhy:"A hydrating green-tea foam, if you prefer a foam over a gel.",dataReason:"A low-pH cleanser is the safest daily starting point for every skin type — it removes buildup without disturbing the skin barrier."},
  {name:"AHA BHA PHA 30 Days Miracle Toner",brand:"Some By Mi",tech:"Triple Acid Exfoliation",ingredient:"Salicylic Acid BHA",texture:"exfoliating toner",why:"Unclogs pores and fades dark spots without heavy peeling — PM use only. Patch-test first if your skin is reactive, and start 2–3 nights a week.",category:"BRIGHTEN",urgency:"ESSENTIAL",timing:"PM",price:"$14–$18",retailer:"YesStyle",url:"https://www.yesstyle.com/en/some-by-mi-aha-bha-pha-30-days-miracle-toner-150ml-2024-version-150ml/info.html/pid.1067311275",rating:"4.6",ratingCount:"42k+",altName:"BHA Blackhead Power Liquid",altBrand:"COSRX",altPrice:"$18–$22",altRetailer:"Amazon",altUrl:"https://www.amazon.com/dp/B00OZEJ8R8",altRating:"4.5",altWhy:"A leave-on BHA treatment for stubborn blackheads and congestion.",dataReason:"A gentle exfoliating toner used at night is the highest-leverage step for clearer pores and a more even tone over time."},
  {name:"Snail Mucin 96% Power Repairing Essence",brand:"COSRX",tech:"Snail Secretion Filtrate",ingredient:"Snail Mucin 96%",texture:"essence serum",why:"Deeply repairs the barrier and boosts hydration with a lightweight, fast-absorbing texture.",category:"BARRIER",urgency:"ESSENTIAL",timing:"AM + PM",price:"$18–$25",retailer:"Amazon",url:"https://www.amazon.com/dp/B00PBX3L7K",rating:"4.8",ratingCount:"127k+",altName:"Galactomyces 95 Tone Balancing Essence",altBrand:"COSRX",altPrice:"$18–$20",altRetailer:"iHerb",altUrl:"https://www.iherb.com/pr/cosrx-galactomyces-95-tone-balancing-essence-3-38-fl-oz-100-ml/82107",altRating:"4.6",altWhy:"A fermented essence that leans brighter and more even-toned.",dataReason:"Snail mucin is one of the most clinically backed barrier-repair ingredients in K-beauty, and it layers under any moisturizer."},
  {name:"Root:Gen Scalp Serum for Thinning Hair",brand:"Ryo",tech:"6-Herbal Complex + Adenosine",ingredient:"Adenosine + Ginseng Root",texture:"scalp serum",why:"Strengthens hair roots and supports thinning hair with a clinically tested herbal complex.",category:"REPAIR",urgency:"ESSENTIAL",timing:"AM + PM",price:"$18–$24",retailer:"Amazon",url:"https://www.amazon.com/dp/B0GMHP5TXD",rating:"4.6",ratingCount:"8k+",altName:"Multi-Perfection Hair Loss Care Tonic",altBrand:"Dr. Groot",altPrice:"$26–$30",altRetailer:"YesStyle",altUrl:"https://www.yesstyle.com/en/dr-groot-multi-perfection-hair-loss-care-tonic-hoofdhuidverzorging/info.html/pid.1129963324",altRating:"4.4",altWhy:"A leave-on tonic from another leading Korean scalp line, focused on hair-loss care.",dataReason:"Ryo is Korea's #1 scalp-care brand and this serum is clinically tested for hair-loss care — most relevant if thinning is a concern."},
  {name:"Water Bank Blue Hyaluronic Cream Moisturizer",brand:"Laneige",tech:"Blue Hyaluronic Acid Fermentation",ingredient:"Blue Hyaluronic Acid",texture:"gel cream",why:"Deep, lasting hydration from fermented blue hyaluronic acid in a cushiony cream.",category:"HYDRATE",urgency:"RECOMMENDED",timing:"AM + PM",price:"$36–$42",retailer:"Laneige",url:"https://int.laneige.com/products/water-bank-blue-hyaluronic-cream-moisturizer",rating:"4.6",ratingCount:"31k+",altName:"Water Sleeping Mask",altBrand:"Laneige",altPrice:"$18–$24",altRetailer:"Amazon",altUrl:"https://www.amazon.com/dp/B09HN8JBFP",altRating:"4.7",altWhy:"An overnight mask for an extra hydration boost a few nights a week.",dataReason:"A dependable daily moisturizer suits most climates and skin types, and layers cleanly under SPF in the morning."},
  {name:"Cicapair Soothing Color Correcting Treatment SPF 30",brand:"Dr. Jart+",tech:"Cica Complex + UV Shield",ingredient:"Centella Asiatica",texture:"color-correcting cream",why:"Color-correcting SPF that neutralizes redness while it protects — a two-in-one morning step.",category:"PROTECT",urgency:"ESSENTIAL",timing:"AM",price:"$30–$38",retailer:"Amazon",url:"https://www.amazon.com/dp/B0F7J33CP4",rating:"4.5",ratingCount:"18k+",altName:"Matte Sun Stick: Mugwort + Camelia SPF 50+",altBrand:"Beauty of Joseon",altPrice:"$12–$16",altRetailer:"YesStyle",altUrl:"https://www.yesstyle.com/en/beauty-of-joseon-matte-sun-stick-18g/info.html/pid.1119542494",altRating:"4.8",altWhy:"A portable stick format that makes reapplication through the day easy.",dataReason:"Daily SPF is the highest-impact morning step for every profile; the Cica base also calms visible redness while it protects."},
];

const questions = [
  {id:"texture",code:"SKN_01",section:"SKIN",question:"By midday, your skin feels —",sub:"Select all that apply.",options:[{label:"Tight + parched",value:"dry",tag:"DRY"},{label:"Slick all over",value:"oily",tag:"OILY"},{label:"Oily T-zone, dry cheeks",value:"combination",tag:"COMBO"},{label:"Calm + balanced",value:"normal",tag:"NORMAL"}]},
  {id:"sensitivity",code:"SKN_02",section:"SKIN",question:"How does skin respond to new products?",sub:"Select all that apply.",options:[{label:"Burns or turns red",value:"sensitive",tag:"HIGH"},{label:"Occasional breakouts",value:"reactive",tag:"MED"},{label:"Usually adapts fine",value:"tolerant",tag:"LOW"},{label:"Never reacts",value:"resilient",tag:"NONE"}]},
  {id:"concerns",code:"SKN_03",section:"SKIN",question:"Primary skin objectives —",sub:"Select all that apply.",options:[{label:"Dullness + uneven tone",value:"brightening",tag:"GLOW"},{label:"Fine lines + firmness",value:"antiaging",tag:"AGE"},{label:"Acne + congestion",value:"acne",tag:"CLEAR"},{label:"Dehydration + plumpness",value:"hydration",tag:"H2O"},{label:"Dark spots + hyperpigmentation",value:"pigmentation",tag:"PIGMENT"},{label:"Redness + irritation",value:"redness",tag:"CALM"}]},
  {id:"scalp_concern",code:"SCP_01",section:"SCALP",question:"Any scalp concerns? —",sub:"Select all that apply.",options:[{label:"Dry + flaky scalp",value:"dry_scalp",tag:"DRY"},{label:"Oily scalp + buildup",value:"oily_scalp",tag:"OILY"},{label:"Sensitive or itchy scalp",value:"sensitive_scalp",tag:"SENSITIVE"},{label:"Thinning or hair loss",value:"thinning",tag:"THINNING"},{label:"Dandruff",value:"dandruff",tag:"DANDRUFF"},{label:"No scalp concerns",value:"none",tag:"NONE"}]},
  {id:"scalp_habit",code:"SCP_02",section:"SCALP",question:"How often do you wash your hair? —",sub:"Select one.",options:[{label:"Daily",value:"daily",tag:"DAILY"},{label:"Every 2–3 days",value:"every2to3",tag:"2–3 DAYS"},{label:"Twice a week",value:"twice_week",tag:"2X WEEK"},{label:"Once a week or less",value:"weekly",tag:"WEEKLY"}]},
  {id:"scalp",code:"SKN_04",section:"SKIN",question:"How does your scalp feel? —",sub:"Select all that apply.",options:[{label:"Dry + flaky",value:"dry_scalp",tag:"DRY"},{label:"Oily + itchy",value:"oily_scalp",tag:"OILY"},{label:"Sensitive + irritated",value:"sensitive_scalp",tag:"SENSITIVE"},{label:"Hair thinning or loss",value:"thinning",tag:"THINNING"},{label:"Balanced + no concerns",value:"balanced_scalp",tag:"BALANCED"}]},
  {id:"age",code:"PRF_01",section:"PROFILE",question:"Your age range —",sub:"Skin needs shift every decade.",options:[{label:"Under 25",value:"under25",tag:"18–24"},{label:"25 to 34",value:"25to34",tag:"25–34"},{label:"35 to 44",value:"35to44",tag:"35–44"},{label:"45 to 54",value:"45to54",tag:"45–54"},{label:"55 to 64",value:"55to64",tag:"55–64"},{label:"65 to 74",value:"65to74",tag:"65–74"},{label:"75 and over",value:"75plus",tag:"75+"}]},
  {id:"climate",code:"PRF_02",section:"PROFILE",question:"Where do you live? —",sub:"Climate shapes your barrier daily.",options:[{label:"Hot + humid",value:"tropical",tag:"TROPICAL"},{label:"Hot + dry",value:"arid",tag:"ARID"},{label:"Cold + dry",value:"cold",tag:"COLD"},{label:"Mild + temperate",value:"temperate",tag:"MILD"}]},
  {id:"sunlight",code:"LFE_01",section:"LIFESTYLE",question:"Daily sun exposure —",sub:"Average hours of direct sunlight.",options:[{label:"Indoor most of the day",value:"indoor",tag:"< 1HR"},{label:"Some outdoor time",value:"moderate",tag:"1–3HR"},{label:"Outdoors a lot",value:"high",tag:"3–6HR"},{label:"Full day in the sun",value:"extreme",tag:"6HR+"}]},
  {id:"habits",code:"LFE_02",section:"LIFESTYLE",question:"Which habits describe you? —",sub:"Select all that apply.",options:[{label:"Workouts + sweating daily",value:"active",tag:"ACTIVE"},{label:"Mostly desk / screen time",value:"sedentary",tag:"DESK"},{label:"Travel + irregular schedule",value:"travel",tag:"TRAVEL"},{label:"High stress + poor sleep",value:"stressed",tag:"STRESS"},{label:"Drinks alcohol regularly",value:"alcohol",tag:"ALCOHOL"},{label:"Smoker or ex-smoker",value:"smoker",tag:"SMOKE"}]},
  {id:"routine",code:"LFE_03",section:"LIFESTYLE",question:"Current Korean Beauty routine level —",sub:"Be honest.",options:[{label:"Total beginner",value:"beginner",tag:"LVL 0"},{label:"Cleanser + moisturizer",value:"minimal",tag:"LVL 1"},{label:"4–6 step routine",value:"intermediate",tag:"LVL 2"},{label:"Full 10-step devotee",value:"advanced",tag:"LVL 3"}]},
];

function LoadingLine({text,delay}){
  const[vis,setVis]=useState(false);const[done,setDone]=useState(false);
  useEffect(()=>{const t1=setTimeout(()=>setVis(true),delay);const t2=setTimeout(()=>setDone(true),delay+500);return()=>{clearTimeout(t1);clearTimeout(t2);};},[delay]);
  if(!vis)return null;
  return(<div style={{fontSize:"0.86rem",color:done?"#4ecdc4":C.textMuted,marginBottom:"0.75rem",letterSpacing:"0.04em",animation:"fadeUp 0.3s ease"}}>
    <span style={{color:done?"#4ecdc4":C.amber,marginRight:"0.8rem"}}>{done?"✓":"›"}</span>{text}</div>);
}

function RecCard({rec,index,stepNum,t}){
  const[open,setOpen]=useState(false);
  const urg=urgencyStyle[rec.urgency]||urgencyStyle.RECOMMENDED;
  const col=catColor[rec.category]||C.amber;
  const retCol=retailerColor[rec.retailer]||C.amber;
  return(
    <div style={{border:`1px solid ${C.border}`,borderRadius:"4px",background:"#0d0d0d",position:"relative",overflow:"hidden",animation:`fadeUp 0.4s ease ${index*0.09}s both`}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:col,boxShadow:`0 0 10px ${col}60`}}/>
      <div style={{padding:"0.9rem 1.1rem 0.9rem 1.33rem"}}>
        {/* step + badges */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.64rem"}}>
          <span style={{fontSize:"0.69rem",color:col,letterSpacing:"0.2em",fontWeight:600}}>STEP {stepNum} · {stepCategory(rec.texture)}</span>
          <div style={{display:"flex",gap:"0.47rem"}}>
            {rec.timing&&<span style={{fontSize:"0.65rem",color:C.textDim,border:`1px solid ${C.border}`,borderRadius:"2px",padding:"0.1rem 0.55rem",letterSpacing:"0.1em"}}>{rec.timing}</span>}
            <span style={{fontSize:"0.65rem",letterSpacing:"0.12em",color:urg.color,border:`1px solid ${urg.border}`,borderRadius:"2px",padding:"0.1rem 0.55rem",background:urg.bg}}>{rec.urgency}</span>
          </div>
        </div>
        {/* first pick label */}
        <div style={{fontSize:"0.6rem",color:col,letterSpacing:"0.1em",marginBottom:"0.18rem"}}>{t.firstPick}</div>
        {/* brand + name */}
        <div style={{fontSize:"0.69rem",color:C.textDim,letterSpacing:"0.2em",marginBottom:"0.35rem"}}>{rec.brand?.toUpperCase()}</div>
        <div style={{fontSize:"1.04rem",color:C.text,fontFamily:C.sans,fontWeight:400,lineHeight:1.25,marginBottom:"0.62rem"}}>{rec.name}</div>
        {/* why italic */}
        <p style={{fontSize:"0.85rem",color:"#908888",lineHeight:1.55,marginBottom:"0.72rem",fontStyle:"italic"}}>"{rec.why}"</p>
        {/* tech chips */}
        <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.8rem"}}>
          {[["TECH",rec.tech],["KEY",rec.ingredient],["FORM",rec.texture]].map(([l,v])=>(
            <span key={l} style={{fontSize:"0.67rem",color:C.textMuted,background:"#161616",border:`1px solid ${C.border}`,borderRadius:"2px",padding:"0.12rem 0.6rem"}}>
              <span style={{color:C.textDim}}>{l}: </span>{v}</span>))}
        </div>

        {/* price + rating + buy */}
        <div style={{display:"flex",alignItems:"stretch",gap:"0.5rem",marginBottom:"0.75rem"}}>
          <div style={{padding:"0.5rem 0.75rem",background:"#0a0a0a",border:`1px solid ${C.border}`,borderRadius:"3px",flex:1}}>
            <div style={{fontSize:"0.6rem",color:C.textDim,letterSpacing:"0.08em",marginBottom:"0.2rem"}}>{t.firstChoice}</div>
            <div style={{fontSize:"1rem",color:C.text,fontFamily:C.sans,fontWeight:500,marginBottom:"0.25rem"}}>{rec.price}</div>
            {rec.rating&&<div style={{display:"flex",alignItems:"center",gap:"0.3rem"}}>
              <span style={{color:"#f4c542",fontSize:"0.75rem"}}>{"★".repeat(Math.round(parseFloat(rec.rating||0)))}</span>
              <span style={{fontSize:"0.68rem",color:C.textMuted}}>{rec.rating} {rec.ratingCount&&<span style={{color:C.textDim}}>({rec.ratingCount})</span>}</span>
            </div>}
          </div>
          <a href={getRetailerURL(rec.retailer, rec.name, rec.brand, rec.url)} target="_blank" rel="noopener noreferrer" onClick={()=>{try{if(window.trackEvent)window.trackEvent("buy_clicked",{product:rec.name,brand:rec.brand,retailer:rec.retailer,price:rec.price});}catch(e){}}}
            style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"0.5rem 0.75rem",background:`${retCol}14`,border:`1px solid ${retCol}50`,borderRadius:"3px",textDecoration:"none",flexShrink:0,width:"100px",maxWidth:"100px",overflow:"hidden",transition:"all 0.15s"}}>
            <span style={{fontSize:"0.75rem",color:retCol,fontWeight:600,letterSpacing:"0.03em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{rec.retailer} →</span>
          </a>
        </div>

        {/* alt product — always render if any alt field exists */}
        {(rec.altName||rec.altBrand)&&(
          <div style={{marginBottom:"0.75rem",padding:"0.65rem 0.75rem",background:"#080808",border:`1px solid ${C.border}`,borderLeft:`2px solid ${col}40`,borderRadius:"3px"}}>
            <div style={{fontSize:"0.6rem",color:C.textDim,letterSpacing:"0.1em",marginBottom:"0.4rem"}}>{t.secondPick}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.5rem"}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:"0.6rem",color:C.textDim,letterSpacing:"0.12em",marginBottom:"0.1rem"}}>{(rec.altBrand||"").toUpperCase()}</div>
                <div style={{fontSize:"0.88rem",color:"#c8c0b8",fontFamily:C.sans,lineHeight:1.25,marginBottom:"0.28rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{rec.altName}</div>
                <div style={{display:"flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap"}}>
                  {rec.altRating&&<span style={{color:"#f4c542",fontSize:"0.68rem"}}>{"★".repeat(Math.round(parseFloat(rec.altRating||0)))}</span>}
                  {rec.altRating&&<span style={{fontSize:"0.65rem",color:C.textMuted}}>{rec.altRating}</span>}
                  {rec.altPrice&&<span style={{fontSize:"0.68rem",color:C.textMuted}}>{rec.altPrice}</span>}
                </div>
              </div>
              {rec.altRetailer&&<a href={getRetailerURL(rec.altRetailer,rec.altName||"",rec.altBrand||"",rec.altUrl)} target="_blank" rel="noopener noreferrer"
                style={{fontSize:"0.65rem",color:retailerColor[rec.altRetailer]||C.textMuted,border:`1px solid ${(retailerColor[rec.altRetailer]||C.textMuted)+"40"}`,borderRadius:"2px",padding:"0.28rem 0.6rem",textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>
                {rec.altRetailer} →
              </a>}
            </div>
            {rec.altWhy&&<div style={{fontSize:"0.75rem",color:"#7d766f",lineHeight:1.5,marginTop:"0.45rem",fontStyle:"italic"}}>"{rec.altWhy}"</div>}
          </div>
        )}

        {/* why recommended — expandable */}
        <button onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:"0.62rem",background:"transparent",border:"none",cursor:"pointer",padding:0,fontFamily:C.mono}}>
          <span style={{fontSize:"0.69rem",color:C.textDim,letterSpacing:"0.10em"}}>{t.whyRec}</span>
          <span style={{fontSize:"0.75rem",color:C.textDim,transition:"transform 0.2s",display:"inline-block",transform:open?"rotate(90deg)":"rotate(0deg)"}}>›</span>
        </button>
        {open&&(
          <div style={{marginTop:"0.57rem",padding:"0.5rem 0.83rem",background:"#111",border:`1px solid ${C.border}`,borderRadius:"3px",animation:"fadeUp 0.2s ease"}}>
            <div style={{fontSize:"0.8rem",color:C.textMuted,lineHeight:1.65}}>{rec.dataReason}</div>
          </div>
        )}
      </div>
    </div>);
}

function buildText(recs,answers){
  const profile=[answers.texture?.selected?.join(", "),answers.age?.selected?.join(", "),answers.climate?.selected?.join(", "),answers.sunlight?.selected?.join(", ")].filter(Boolean).join(" · ");
  return["✦ MY MEEMO KOREAN BEAUTY PROTOCOL","Profile: "+profile,"",...recs.map((r,i)=>{
    const stars="★".repeat(Math.round(parseFloat(r.rating||0)));
    const alt=r.altName?`   ALT: ${r.altName} — ${r.altBrand} · ${r.altPrice} · ${r.altRetailer}${r.altRetailer?` · Buy: ${getRetailerURL(r.altRetailer,r.altName,r.altBrand,r.altUrl)}`:""}\n`:"";
    return `${i+1}. ${r.name} — ${r.brand}\n   ${stepLabel(r.texture)} · ${r.timing||""}\n   Rating: ${stars} ${r.rating} (${r.ratingCount})\n   First choice: ${r.price} · Buy: ${getRetailerURL(r.retailer,r.name,r.brand,r.url)}\n${alt}   Key: ${r.ingredient} · ${r.tech}\n   "${r.why}"\n`;
  }),"Generated by Meemo Wellness AI"].join("\n");
}

export default function MeemoSkinQuiz(){
  const[lang,setLang]=useState("en");
  const t=T[lang]||T.en;
  const[step,setStep]=useState(0);
  const[answers,setAnswers]=useState({});
  const[fading,setFading]=useState(false);
  const[loading,setLoading]=useState(false);
  const[recs,setRecs]=useState(null);
  const[apiNote,setApiNote]=useState(null);
  const[dots,setDots]=useState(".");
  const[cursor,setCursor]=useState(true);
  const[scanY,setScanY]=useState(0);
  const[copied,setCopied]=useState(false);
  const[phone,setPhone]=useState("");
  const[smsSent,setSmsSent]=useState(false);
  const[profileName,setProfileName]=useState("");
  const[profileEmail,setProfileEmail]=useState("");
  const[profileSaved,setProfileSaved]=useState(false);
  const[selfieData,setSelfieData]=useState(null);
  const[selfiePreview,setSelfiePreview]=useState(null);
  const[selfieAnalysis,setSelfieAnalysis]=useState(null);
  const[skinScan,setSkinScan]=useState(null);
  const selfieRef=useRef(null);
  const shareRef=useRef(null);

  const totalSteps=questions.length;
  const currentQ=questions[step-1];
  const currentAns=currentQ?(answers[currentQ.id]||{selected:[],comment:""}):{selected:[],comment:""};
  const prevSection=step>1?questions[step-2]?.section:null;
  const isNewSection=step>=1&&step<=totalSteps&&currentQ.section!==prevSection;
  const sortedRecs=recs?[...recs].sort((a,b)=>{const diff=stepOrder(a.texture)-stepOrder(b.texture);return diff!==0?diff:0;}):[];
  const skinRecs=sortedRecs.filter(r=>!r.texture?.toLowerCase().includes("scalp"));
  const scalpRecs=sortedRecs.filter(r=>r.texture?.toLowerCase().includes("scalp"));

  useEffect(()=>{const iv=setInterval(()=>setCursor(c=>!c),530);return()=>clearInterval(iv);},[]);
  useEffect(()=>{if(!loading)return;const iv=setInterval(()=>setDots(d=>d.length>=3?".":d+"."),380);return()=>clearInterval(iv);},[loading]);
  useEffect(()=>{const iv=setInterval(()=>setScanY(y=>(y+0.4)%100),30);return()=>clearInterval(iv);},[]);

  const go=(cb)=>new Promise(r=>{setFading(true);setTimeout(()=>{cb();setFading(false);r();},280);});
  const track=(name,props={})=>{
    try{if(window.trackEvent)window.trackEvent(name,props);}catch(e){}
    try{if(posthog)posthog.capture(name,props);}catch(e){}
  };
  const EXCLUSIVE_ALL={texture:["normal"],sensitivity:["sensitive","reactive","tolerant","resilient"],scalp_concern:["none"],scalp:["balanced_scalp"]};
  const EXCLUSIVE_PAIRS={texture:{dry:["oily"],oily:["dry"]}};
  const toggleOption=(value)=>{
    const prev=answers[currentQ.id]||{selected:[],comment:""};
    if(prev.selected.includes(value)){setAnswers({...answers,[currentQ.id]:{...prev,selected:prev.selected.filter(v=>v!==value)}});return;}
    let sel=[...prev.selected];
    const allVals=EXCLUSIVE_ALL[currentQ.id]||[];
    if(allVals.includes(value)||currentQ.id==="sensitivity"){sel=[];}
    else{
      sel=sel.filter(v=>!allVals.includes(v));
      const clears=EXCLUSIVE_PAIRS[currentQ.id]?.[value]||[];
      sel=sel.filter(v=>!clears.includes(v));
    }
    setAnswers({...answers,[currentQ.id]:{...prev,selected:[...sel,value]}});
  };
  const setComment=(text)=>{const prev=answers[currentQ.id]||{selected:[],comment:""};setAnswers({...answers,[currentQ.id]:{...prev,comment:text}});};
  const canContinue=currentAns.selected.length>0||currentAns.comment.trim().length>0;

  const SELFIE_STEP=totalSteps+1;
  const LOADING_STEP=totalSteps+2;
  const RESULTS_STEP=totalSteps+3;

  const handleNext=async()=>{
    if(step===0){track("quiz_started");await go(()=>setStep(1));return;}
    if(step>=1&&step<=totalSteps){
      if(!canContinue)return;
      if(step<totalSteps){track("question_answered",{question:currentQ.id,step,selected:currentAns.selected,hasNote:!!currentAns.comment.trim()});await go(()=>setStep(step+1));}
      else{track("selfie_step_reached");await go(()=>setStep(SELFIE_STEP));}
      return;
    }
    if(step===SELFIE_STEP){
      track(selfieData?"selfie_uploaded":"selfie_skipped");
      setStep(LOADING_STEP);
      setLoading(true);
      await fetchRecs(answers,selfieData);
      setLoading(false);
      setStep(RESULTS_STEP);
      setTimeout(()=>setStep(RESULTS_STEP),100);
    }
  };
  const handleBack=()=>{
    if(step===SELFIE_STEP){go(()=>setStep(totalSteps));return;}
    if(step<2)return;
    go(()=>setStep(step-1));
  };
  const handleSkip=async()=>{
    if(step<1||step>totalSteps)return;
    track("question_skipped",{question:currentQ.id,step});
    if(step<totalSteps){await go(()=>setStep(step+1));}
    else{track("selfie_step_reached");await go(()=>setStep(SELFIE_STEP));}
  };

  const fetchRecs=async(ans,imgData=null)=>{
    console.log('fetchRecs called, ans keys:',Object.keys(ans));
    setApiNote(null);
    const fmt=(id)=>{const a=ans[id];if(!a)return"not specified";const p=[];if(a.selected?.length)p.push(a.selected.join(", "));if(a.comment?.trim())p.push(`[note: ${a.comment.trim()}]`);return p.join(" — ")||"not specified";};
    const prompt=`You are a Korean dermatology-informed skincare expert with deep knowledge of Korean pharmacy products, Olive Young bestsellers, and dermatologist-recommended Korean skincare.

Your recommendations must meet this standard:
- PRIORITIZE products sold in Korean pharmacies (올리브영 Olive Young, Lalavla, Bonne Santé), dermatology clinics, and recommended by Korean dermatologists
- PREFER products with peer-reviewed or clinical study backing, dermatologist-tested certification, or KFDA approval
- AVOID recommending products that are primarily viral in Western markets without clinical evidence
- FAVOR brands with long track records in Korea: COSRX, Illiyoon, Pyunkang Yul, Isntree, Dr. Jart+, Etude, Mediheal, Anua, Beauty of Joseon, Skin1004, Round Lab, Torriden, Some By Mi, Ryo, Aestura, Cicapair
- For scalp: prioritize clinically tested Korean trichology brands — Ryo, Dr. Groot, Reen, La'dor, Daeng Gi Meo Ri
- Mention if a product is a Korean pharmacy staple or dermatologist-recommended in the dataReason field
- Price should reflect actual Korean market value, not inflated Western import pricing

SKIN PROFILE:
- Midday feel: ${fmt("texture")}
- Sensitivity: ${fmt("sensitivity")}
- Concerns: ${fmt("concerns")}
- Scalp: ${fmt("scalp")}

PERSONAL PROFILE:
- Age: ${fmt("age")}
- Climate: ${fmt("climate")}

SCALP:
- Scalp concerns: ${fmt("scalp_concern")}
- Wash frequency: ${fmt("scalp_habit")}

LIFESTYLE:
- Sun exposure: ${fmt("sunlight")}
- Habits: ${fmt("habits")}
- Routine level: ${fmt("routine")}

RULES:
1. Return products IN ORDER of application: cleanser first, then toner, then serum/ampoule, then moisturizer, then SPF last. The JSON array order must match the application sequence.
2. SCALP RULE: If scalp concerns are present (not "none" — dry, oily, sensitive, thinning, dandruff), REPLACE one of the 5 products with a Korean scalp treatment (scalp serum, scalp toner, or scalp essence) and note it in dataReason. Age 45+ with thinning = prioritize scalp. Use brands like Ryo, Dr. Groot, Innisfree, Some By Mi, COSRX for scalp products. Set texture to "scalp serum" or "scalp treatment" for these.
3. Each from a different brand
4. Prioritize high sun exposure → UV protection first
5. Age 45+ → retinol, peptides, collagen actives
6. Stressed/poor sleep → cortisol + barrier repair focus
7. Tropical/humid → lightweight gel textures only
8. Include REALISTIC price ranges in USD and the best value retailer. Choose from: Amazon, YesStyle, iHerb, Soko Glam, StyleKorean, Stylevana, Olive Young, Peach & Lily, Target, Ulta, Nudie Glow. Pick whichever is genuinely cheapest and most accessible for that product.
9. dataReason must explain EXACTLY which quiz answers drove this specific product choice
10. NEVER contradict the user's answers in why, dataReason, or altWhy (for example, do not mention oily skin if they selected dry, outdoor exposure if they selected indoor, or an age bracket they did not select). If an answer says "not specified", the user skipped that question — do not invent a value for it; keep the reasoning generic for that factor.
11. In "url" and "altUrl", give the direct product page URL at the chosen retailer when you know it exactly; otherwise use null (never guess a URL).

Return ONLY a raw JSON array of 5 objects, no markdown, no backticks, no explanation:
[{
  "name": "product name",
  "brand": "Korean brand",
  "tech": "key technology",
  "ingredient": "hero ingredient",
  "texture": "exact texture type",
  "why": "personalized reason max 15 words",
  "category": "BARRIER|BRIGHTEN|HYDRATE|REPAIR|PROTECT",
  "urgency": "ESSENTIAL|RECOMMENDED|BOOST",
  "timing": "AM|PM|AM + PM",
  "price": "$XX–$XX",
  "retailer": "best value retailer name",
  "url": "direct product page URL at that retailer, or null",
  "retailerNote": "one sentence tip on where to get best price",
  "rating": "overall rating out of 5 e.g. 4.7",
  "ratingCount": "number of reviews e.g. 12k+",
  "altName": "second best product name for same step",
  "altBrand": "second best brand",
  "altPrice": "$XX–$XX",
  "altRetailer": "best value retailer for alt product",
  "altUrl": "direct product page URL for the alt product, or null",
  "altRating": "rating out of 5",
  "altWhy": "one short sentence on why this second pick suits this person",
  "dataReason": "2-3 sentences explaining exactly which quiz inputs drove this recommendation"
}]`;
    const userContent=imgData
      ?[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imgData}},{type:"text",text:prompt+"\n\nIMPORTANT: A selfie has been provided. Do two things:\n1. Analyze the visible skin carefully — look for redness, oiliness, dryness, dark spots, enlarged pores, uneven texture, fine lines, or any visible concerns.\n2. Before the JSON product array, output a skin scan summary in this EXACT format (no markdown):\nSKIN_SCAN_START\n{\"redness\":\"low|moderate|high — describe location\",\"oiliness\":\"low|moderate|high — describe\",\"pores\":\"small|medium|large — describe\",\"darkSpots\":\"none|mild|moderate|significant — describe\",\"texture\":\"smooth|slightly uneven|rough — describe\",\"hydration\":\"well hydrated|slightly dehydrated|dehydrated\",\"overall\":\"one sentence summary of what you see\"}\nSKIN_SCAN_END\nThen output the product JSON array. Factor all visual observations into product choices."}]
      :[{type:"text",text:prompt}];
    try{
      const res=await fetch("/api/recommend",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:3000,messages:[{role:"user",content:userContent}]})});
      const data=await res.json();
      if(data.type==="error"||data.error){setApiNote(t.fallbackNote);setRecs(DEMO_RECS);return;}
      // Handle tool_use blocks from web search — extract only text blocks
      const raw=(data.content||[]).filter(i=>i.type==="text").map(i=>i.text||"").join("")||"";
      // Extract skin scan if present
      const scanStart=raw.indexOf("SKIN_SCAN_START");
      const scanEnd=raw.indexOf("SKIN_SCAN_END");
      if(scanStart!==-1&&scanEnd!==-1){
        try{
          const scanJson=raw.slice(scanStart+15,scanEnd).trim();
          setSkinScan(JSON.parse(scanJson));
        }catch(e){}
      }
      const s=raw.indexOf("["),e=raw.lastIndexOf("]");
      if(s===-1||e===-1)throw new Error("no json");
      const parsed=JSON.parse(raw.slice(s,e+1));
      if(!Array.isArray(parsed)||!parsed.length)throw new Error("empty");
      console.log('setRecs parsed:',parsed.length);
      setRecs(parsed);
      track("analysis_complete",{skinType:ans.texture?.selected,concerns:ans.concerns?.selected,age:ans.age?.selected,usedSelfie:!!imgData});
    }catch(err){setApiNote(t.fallbackNote);setRecs(DEMO_RECS);track("analysis_fallback",{reason:err.message});}
  };

  const handleSelfie=(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const base64=ev.target.result.split(",")[1];
      setSelfieData(base64);
      setSelfiePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy=()=>{
    track("regime_copied");
    const text=buildText(sortedRecs,answers);
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);}).catch(()=>fallbackCopy());}
      else{fallbackCopy();}
    }catch(e){fallbackCopy();}
  };
  const fallbackCopy=()=>{if(shareRef.current){shareRef.current.select();document.execCommand("copy");setCopied(true);setTimeout(()=>setCopied(false),2500);}};
  const handleEmail=()=>{const text=buildText(sortedRecs,answers);window.location.href=`mailto:?subject=${encodeURIComponent("My Meemo Korean Beauty Skin Protocol")}&body=${encodeURIComponent(text)}`;};
  const restart=()=>{track("quiz_restarted");setStep(0);setAnswers({});setRecs(null);setApiNote(null);setCopied(false);setPhone("");setSmsSent(false);setProfileSaved(false);setProfileName("");setProfileEmail("");setSelfieData(null);setSelfiePreview(null);setSelfieAnalysis(null);setSkinScan(null);};

  // Fire Meta + TikTok pixel on results
  useEffect(()=>{
    if(step===RESULTS_STEP&&!loading&&recs){
      try{
        // Meta Pixel — replace PIXEL_ID_HERE with your actual ID
        if(window.fbq){window.fbq("track","CompleteRegistration",{content_name:"Meemo Skin Analysis",skin_type:answers.texture?.selected?.join(","),concern:answers.concerns?.selected?.join(",")});}
        // TikTok Pixel — replace TIKTOK_PIXEL_ID in index.html
        if(window.ttq){window.ttq.track("CompletePayment",{content_name:"Meemo Skin Analysis"});}
      }catch(e){}
    }
  },[step,loading,recs]);

  const handleSMS=()=>{
    if(!phone.trim())return;
    track("regime_sms_sent");
    const text=buildText(sortedRecs,answers);
    const body=encodeURIComponent(text);
    // Opens native SMS app with pre-filled message
    window.location.href=`sms:${phone.trim().replace(/\D/g,"")}?body=${body}`;
    setSmsSent(true);
  };

  const handleSaveProfile=()=>{
    if(!profileName.trim()&&!profileEmail.trim())return;
    track("profile_saved",{hasName:!!profileName.trim(),hasEmail:!!profileEmail.trim()});
    const profile={name:profileName,email:profileEmail,skinType:answers.texture?.selected,concerns:answers.concerns?.selected,age:answers.age?.selected,climate:answers.climate?.selected,habits:answers.habits?.selected,savedAt:new Date().toISOString(),regime:sortedRecs.map(r=>({name:r.name,brand:r.brand,step:stepLabel(r.texture),timing:r.timing}))};
    try{localStorage.setItem("meemo_profile",JSON.stringify(profile));}catch(e){}
    setProfileSaved(true);
  };

  const primaryBtn={background:C.amber,color:"#000",border:"none",borderRadius:"3px",padding:"0.8rem 1.33rem",fontSize:"0.9rem",letterSpacing:"0.08em",cursor:"pointer",fontFamily:C.mono,fontWeight:500};
  const ghostBtn={background:"transparent",color:C.textMuted,border:`1px solid ${C.border}`,borderRadius:"3px",padding:"0.8rem 1.2rem",fontSize:"0.88rem",letterSpacing:"0.08em",cursor:"pointer",fontFamily:C.mono,flexShrink:0};

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1.1rem",fontFamily:C.mono,position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",backgroundImage:`linear-gradient(rgba(232,146,10,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(232,146,10,0.022) 1px, transparent 1px)`,backgroundSize:"44px 44px"}}/>
      <div style={{position:"fixed",left:0,right:0,height:"2px",top:`${scanY}%`,background:"linear-gradient(90deg, transparent, rgba(232,146,10,0.055), transparent)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",top:"25%",left:"50%",transform:"translateX(-50%)",width:"700px",height:"350px",borderRadius:"50%",background:"radial-gradient(ellipse, rgba(232,146,10,0.035) 0%, transparent 65%)",pointerEvents:"none"}}/>

      <div style={{width:"100%",maxWidth:"580px",opacity:fading?0:1,transform:fading?"translateY(10px)":"translateY(0)",transition:"all 0.28s cubic-bezier(0.16,1,0.3,1)"}}>

        {/* topbar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.8rem",paddingBottom:"0.88rem",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.72rem"}}>
            <div style={{width:"9px",height:"9px",borderRadius:"50%",background:C.amber,boxShadow:`0 0 8px ${C.amber}`}}/>
            <span style={{fontSize:"0.8rem",color:C.amber,letterSpacing:"0.14em"}}>{t.brand}</span>
            <span style={{fontSize:"0.8rem",color:C.textDim,letterSpacing:"0.1em"}}>{t.sub}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.35rem"}}>
            {[["en","EN"],["es","ES"],["pt","PT"],["ko","한"],["zh","中"]].map(([code,lbl])=>(
              <button key={code} onClick={()=>setLang(code)} style={{background:lang===code?C.amber:"transparent",color:lang===code?"#000":C.textDim,border:`1px solid ${lang===code?C.amber:C.border}`,borderRadius:"2px",padding:"0.18rem 0.45rem",fontSize:"0.58rem",fontFamily:C.mono,cursor:"pointer",letterSpacing:"0.06em",transition:"all 0.15s"}}>{lbl}</button>
            ))}
            {step>0&&step<=totalSteps&&<span style={{fontSize:"0.78rem",color:C.textMuted,letterSpacing:"0.10em",marginLeft:"0.5rem"}}>{String(step).padStart(2,"0")} / {String(totalSteps).padStart(2,"0")}</span>}
          </div>
        </div>

        {/* progress */}
        {step>0&&step<=totalSteps&&(
          <div style={{marginBottom:"1.58rem"}}>
            <div style={{display:"flex",gap:"4px",marginBottom:"0.72rem"}}>
              {questions.map((q,i)=><div key={i} style={{flex:1,height:"2px",background:i<step?(sectionColors[q.section]||C.amber):C.border,boxShadow:i<step?`0 0 6px ${sectionColors[q.section]||C.amber}55`:"none",transition:"all 0.4s ease",borderRadius:"1px"}}/>)}
            </div>
            <div style={{display:"flex",gap:"1.3rem"}}>
              {[["SKIN",t.secSkin],["SCALP",t.secScalp],["PROFILE",t.secProfile],["LIFESTYLE",t.secLifestyle]].map(([sec,lbl])=><span key={sec} style={{fontSize:"0.72rem",letterSpacing:"0.10em",color:currentQ?.section===sec?sectionColors[sec]:C.textDim,transition:"color 0.3s"}}>{lbl}</span>)}
            </div>
          </div>
        )}

        {/* card */}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"4px",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.7)"}}>
          <div style={{background:"#0d0d0d",borderBottom:`1px solid ${C.border}`,padding:"0.6rem 1.3rem",display:"flex",alignItems:"center",gap:"0.67rem"}}>
            {["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:"8px",height:"8px",borderRadius:"50%",background:c,opacity:0.65}}/>)}
            <span style={{fontSize:"0.78rem",color:C.textDim,letterSpacing:"0.10em",marginLeft:"0.8rem"}}>
              {step===0?"skin_diagnostics.meemo":step<=totalSteps?`${currentQ?.section?.toLowerCase()}_${currentQ?.code?.toLowerCase()}.run`:step===SELFIE_STEP?"skin_scan.meemo":step===LOADING_STEP?"processing_results.meemo":"skin_report.output"}
            </span>
          </div>

          <div style={{padding:"2rem 2.25rem 2.5rem"}}>

            {/* INTRO */}
            {step===0&&(
              <div>
                <div style={{fontSize:"0.78rem",color:C.amber,letterSpacing:"0.14em",marginBottom:"1.1rem"}}>{t.version}</div>
                <div style={{fontSize:"0.88rem",color:C.textDim,marginBottom:"0.9rem"}}>
                  <span style={{color:C.textMuted}}>$ init </span><span style={{color:C.text}}>{t.terminal}</span>
                  <span style={{color:C.amber,opacity:cursor?1:0}}>_</span>
                </div>
                <h1 style={{fontFamily:C.sans,fontSize:"1.9rem",fontWeight:300,color:C.text,lineHeight:1.2,marginBottom:"1.1rem"}}>
                  {t.headline1}<br/><span style={{color:C.amber}}>{t.headline2}</span>
                </h1>
                <p style={{fontSize:"0.88rem",color:C.textMuted,lineHeight:1.85,marginBottom:"1.58rem"}}>
                  {t.subtitle}
                </p>
                <div style={{display:"flex",gap:"0.62rem",marginBottom:"1.58rem"}}>
                  {[[t.secSkin,"4 q's","#e8920a"],[t.secScalp,"2 q's","#f78fb3"],[t.secProfile,"2 q's","#4ecdc4"],[t.secLifestyle,"3 q's","#a29bfe"]].map(([sec,n,col])=>(
                    <div key={sec} style={{flex:1,border:`1px solid ${C.border}`,borderRadius:"3px",padding:"0.7rem 0.95rem",background:"#0d0d0d",borderTop:`2px solid ${col}`}}>
                      <div style={{fontSize:"0.72rem",color:col,letterSpacing:"0.10em",marginBottom:"0.47rem"}}>{sec}</div>
                      <div style={{fontSize:"0.8rem",color:C.textMuted}}>{n}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.62rem",marginBottom:"1.58rem"}}>
                  {[[t.yourPace,t.yourPaceDesc],[t.skinScalp,t.skinScalpDesc],[t.koreanInno,t.koreanInnoDesc],[t.bestPrice,t.bestPriceDesc]].map(([tile,desc])=>(
                    <div key={t} style={{border:`1px solid ${C.border}`,borderRadius:"3px",padding:"0.65rem 0.95rem",background:"#0d0d0d"}}>
                      <div style={{fontSize:"0.72rem",color:C.amber,letterSpacing:"0.10em",marginBottom:"0.44rem"}}>{tile}</div>
                      <div style={{fontSize:"0.8rem",color:C.textMuted}}>{desc}</div>
                    </div>
                  ))}
                </div>
                <button onClick={handleNext} style={{...primaryBtn,width:"100%"}}>{t.begin}</button>
                <div style={{marginTop:"1.1rem",padding:"0.75rem 0.9rem",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px"}}>
                  <div style={{fontSize:"0.62rem",color:C.textMuted,letterSpacing:"0.16em",marginBottom:"0.4rem"}}>{t.legalTitle}</div>
                  <p style={{fontSize:"0.66rem",color:C.textDim,lineHeight:1.65}}>{t.legalBody}</p>
                </div>
              </div>
            )}

            {/* QUESTIONS */}
            {step>=1&&step<=totalSteps&&(
              <div>
                {isNewSection&&(
                  <div style={{display:"flex",alignItems:"center",gap:"0.8rem",marginBottom:"1.3rem",paddingBottom:"0.88rem",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{width:"3px",height:"14px",background:sectionColors[currentQ.section],borderRadius:"2px",boxShadow:`0 0 6px ${sectionColors[currentQ.section]}`}}/>
                    <span style={{fontSize:"0.72rem",color:sectionColors[currentQ.section],letterSpacing:"0.14em"}}>{currentQ.section==="SKIN"?t.skinSection:currentQ.section==="SCALP"?t.scalpSection:currentQ.section==="PROFILE"?t.profileSection:t.lifestyleSection}</span>
                  </div>
                )}
                <div style={{marginBottom:"1.33rem"}}>
                  <div style={{fontSize:"0.74rem",color:sectionColors[currentQ.section]||C.amber,letterSpacing:"0.2em",marginBottom:"0.72rem"}}>{currentQ.code} ──</div>
                  <h2 style={{fontFamily:C.sans,fontSize:"1.2rem",fontWeight:400,color:C.text,lineHeight:1.35,marginBottom:"0.47rem"}}>{currentQ.question}</h2>
                  <p style={{fontSize:"0.8rem",color:C.textMuted}}>{currentQ.sub}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1.1rem"}}>
                  {currentQ.options.map(opt=>{
                    const on=currentAns.selected.includes(opt.value);
                    const sec=sectionColors[currentQ.section]||C.amber;
                    return(
                      <button key={opt.value} onClick={()=>toggleOption(opt.value)} style={{display:"flex",alignItems:"center",gap:"0.97rem",padding:"0.7rem 1.02rem",background:on?`${sec}10`:"transparent",border:`1px solid ${on?sec:C.border}`,borderRadius:"3px",cursor:"pointer",textAlign:"left",transition:"all 0.14s",fontFamily:C.mono}}>
                        <div style={{width:"13px",height:"13px",borderRadius:"2px",flexShrink:0,border:`1px solid ${on?sec:C.border}`,background:on?sec:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.14s"}}>
                          {on&&<span style={{fontSize:"0.72rem",color:"#000",fontWeight:700}}>✓</span>}
                        </div>
                        <span style={{fontSize:"0.72rem",letterSpacing:"0.10em",color:on?sec:C.textDim,minWidth:"46px",transition:"color 0.14s"}}>{opt.tag}</span>
                        <span style={{fontSize:"0.94rem",color:on?C.text:"#7a7068",transition:"color 0.14s"}}>{opt.label}</span>
                      </button>);
                  })}
                </div>
                <div style={{marginBottom:"1.58rem"}}>
                  <div style={{fontSize:"0.71rem",color:C.textDim,letterSpacing:"0.10em",marginBottom:"0.6rem"}}>
                    <span style={{color:sectionColors[currentQ.section]||C.amber}}>+</span> {t.stepNote} <span style={{color:C.textDim}}>{t.noteOptional}</span>
                  </div>
                  <textarea value={currentAns.comment} onChange={e=>setComment(e.target.value)} placeholder={t.notePlaceholder} rows={2}
                    style={{width:"100%",background:"#0d0d0d",border:`1px solid ${currentAns.comment?(sectionColors[currentQ.section]||C.amber)+"55":C.border}`,borderRadius:"3px",padding:"0.65rem 0.97rem",color:C.text,fontFamily:C.mono,fontSize:"0.84rem",lineHeight:1.6,resize:"vertical",outline:"none",transition:"border-color 0.15s"}}
                    onFocus={e=>e.target.style.borderColor=(sectionColors[currentQ.section]||C.amber)+"80"}
                    onBlur={e=>e.target.style.borderColor=currentAns.comment?(sectionColors[currentQ.section]||C.amber)+"55":C.border}/>
                  {currentAns.comment&&<div style={{fontSize:"0.71rem",color:sectionColors[currentQ.section]||C.amber,marginTop:"0.44rem",letterSpacing:"0.1em"}}>{t.noteSaved}</div>}
                </div>
                <div style={{display:"flex",gap:"0.72rem"}}>
                  {step>1&&<button onClick={handleBack} style={ghostBtn}>{t.back}</button>}
                  <button onClick={handleNext} disabled={!canContinue} style={{...primaryBtn,flex:1,opacity:canContinue?1:0.3,cursor:canContinue?"pointer":"not-allowed"}}>
                    {step===totalSteps?t.runAnalysis:t.continueBtn}
                  </button>
                </div>
                <button onClick={handleSkip} style={{background:"transparent",border:"none",color:C.textDim,fontSize:"0.75rem",letterSpacing:"0.08em",cursor:"pointer",fontFamily:C.mono,display:"block",margin:"0.8rem auto 0",padding:"0.2rem 0.5rem"}}>{t.skip}</button>
                {!canContinue&&<div style={{fontSize:"0.71rem",color:C.textDim,textAlign:"center",marginTop:"0.5rem",letterSpacing:"0.08em"}}>{t.continueHint}</div>}
              </div>
            )}

            {/* SELFIE STEP */}
            {step===SELFIE_STEP&&(
              <div>
                <div style={{marginBottom:"1.25rem"}}>
                  <div style={{fontSize:"0.58rem",color:"#4ecdc4",letterSpacing:"0.2em",marginBottom:"0.5rem"}}>SKIN_SCAN ──</div>
                  <h2 style={{fontFamily:C.sans,fontSize:"1.35rem",fontWeight:400,color:C.text,lineHeight:1.3,marginBottom:"0.35rem"}}>{t.selfieTitle}</h2>
                  <p style={{fontSize:"0.78rem",color:C.textMuted,lineHeight:1.75}}>{t.selfieDesc}</p>
                </div>

                {/* upload area */}
                <div onClick={()=>selfieRef.current?.click()} style={{border:`2px dashed ${selfiePreview?"#4ecdc4":C.border}`,borderRadius:"6px",padding:"1.5rem",textAlign:"center",cursor:"pointer",marginBottom:"1rem",background:selfiePreview?"rgba(78,205,196,0.05)":"transparent",transition:"all 0.2s"}}>
                  {selfiePreview?(
                    <div>
                      <img src={selfiePreview} alt="selfie" style={{width:"120px",height:"120px",objectFit:"cover",borderRadius:"50%",border:"2px solid #4ecdc4",marginBottom:"0.75rem"}}/>
                      <div style={{fontSize:"0.72rem",color:"#4ecdc4",letterSpacing:"0.1em"}}>✓ {t.selfieReady}</div>
                      <div style={{fontSize:"0.62rem",color:C.textMuted,marginTop:"0.3rem"}}>{t.selfieChange}</div>
                    </div>
                  ):(
                    <div>
                      <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>📷</div>
                      <div style={{fontSize:"0.78rem",color:C.textMuted,marginBottom:"0.25rem"}}>{t.selfieUpload}</div>
                      <div style={{fontSize:"0.62rem",color:C.textDim}}>{t.selfieFormat}</div>
                    </div>
                  )}
                </div>
                <input ref={selfieRef} type="file" accept="image/*" capture="user" onChange={handleSelfie} style={{display:"none"}}/>

                {/* privacy note */}
                <div style={{padding:"0.6rem 0.75rem",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px",marginBottom:"1.25rem"}}>
                  <div style={{fontSize:"0.6rem",color:C.textDim,lineHeight:1.65}}>
                    🔒 {t.selfiePrivacy}
                  </div>
                </div>

                <div style={{display:"flex",gap:"0.5rem",justifyContent:"space-between"}}>
                  <button onClick={handleBack} style={{...ghostBtn}}>{t.back}</button>
                  <button onClick={handleNext} style={{...primaryBtn,flex:1}}>
                    {selfiePreview?t.selfieAnalyze:t.selfieSkip}
                  </button>
                </div>
              </div>
            )}

            {/* LOADING */}
            {(step===LOADING_STEP||(step===totalSteps+1&&loading))&&(
              <div style={{padding:"1rem 0"}}>
                <div style={{fontSize:"0.78rem",color:C.amber,letterSpacing:"0.14em",marginBottom:"1.58rem"}}>{t.processing}{dots}</div>
                {["Mapping skin barrier + age profile","Calibrating for climate conditions","Analyzing UV exposure damage risk","Cross-referencing lifestyle factors","Reading your personal notes","Building step-by-step routine order","Finding best prices + retailers","Generating personalized protocol"].map((line,i)=>(
                  <LoadingLine key={line} text={line} delay={i*480}/>
                ))}
              </div>
            )}

            {/* RESULTS */}
            {(!loading&&recs)&&(
              <div>
                {/* header */}
                <div style={{marginBottom:"1.2rem"}}>
                  <div style={{fontSize:"0.76rem",color:C.amber,letterSpacing:"0.14em",marginBottom:"0.57rem"}}>{t.analysisComplete}</div>
                  <h2 style={{fontFamily:C.sans,fontSize:"1.2rem",fontWeight:400,color:C.text,marginBottom:"0.72rem"}}>{t.yourRegime}</h2>
                  {apiNote&&<div style={{fontSize:"0.72rem",color:C.textMuted,background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px",padding:"0.35rem 0.8rem",marginBottom:"0.72rem",letterSpacing:"0.05em"}}>ℹ {apiNote}</div>}

                  {/* ── SKIN SCAN CARD ── */}
                  {skinScan&&selfiePreview&&(
                    <div style={{border:`1px solid #4ecdc440`,borderRadius:"4px",background:"#0d0d0d",padding:"1rem 1.15rem",marginBottom:"1rem",position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"#4ecdc4",boxShadow:"0 0 8px #4ecdc460"}}/>
                      <div style={{paddingLeft:"0.75rem"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"0.85rem",marginBottom:"0.75rem"}}>
                          <img src={selfiePreview} alt="scan" style={{width:"48px",height:"48px",borderRadius:"50%",objectFit:"cover",border:"1.5px solid #4ecdc4",flexShrink:0}}/>
                          <div>
                            <div style={{fontSize:"0.62rem",color:"#4ecdc4",letterSpacing:"0.18em",marginBottom:"0.15rem"}}>{t.scanHeader}</div>
                            <div style={{fontSize:"0.78rem",color:C.textMuted,lineHeight:1.5}}>{skinScan.overall}</div>
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.4rem"}}>
                          {[
                            ["Redness",skinScan.redness],
                            ["Oiliness",skinScan.oiliness],
                            ["Pores",skinScan.pores],
                            ["Dark spots",skinScan.darkSpots],
                            ["Texture",skinScan.texture],
                            ["Hydration",skinScan.hydration],
                          ].filter(([,v])=>v).map(([label,val])=>(
                            <div key={label} style={{padding:"0.4rem 0.55rem",background:"#111",border:`1px solid ${C.border}`,borderRadius:"3px"}}>
                              <div style={{fontSize:"0.52rem",color:C.textDim,letterSpacing:"0.12em",marginBottom:"0.1rem"}}>{label.toUpperCase()}</div>
                              <div style={{fontSize:"0.7rem",color:C.textMuted,lineHeight:1.4}}>{val}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{fontSize:"0.58rem",color:C.textDim,marginTop:"0.6rem",letterSpacing:"0.06em"}}>
                          {t.scanFactored}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* what drove these recs */}
                  <div style={{padding:"0.65rem 0.9rem",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px",marginBottom:"0.8rem"}}>
                    <div style={{fontSize:"0.69rem",color:C.amber,letterSpacing:"0.10em",marginBottom:"0.62rem"}}>{t.basedOn}</div>
                    <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
                      {[
                        ["SKIN TYPE",answers.texture?.selected,"SKIN"],
                        ["SCALP",answers.scalp?.selected,"SKIN"],
                        ["SENSITIVITY",answers.sensitivity?.selected,"SKIN"],
                        ["CONCERN",answers.concerns?.selected,"SKIN"],
                        ["SCALP",answers.scalp_concern?.selected,"SCALP"],
                        ["AGE",answers.age?.selected,"PROFILE"],
                        ["CLIMATE",answers.climate?.selected,"PROFILE"],
                        ["SUN",answers.sunlight?.selected,"PROFILE"],
                        ["HABITS",answers.habits?.selected,"LIFESTYLE"],
                        ["ROUTINE",answers.routine?.selected,"LIFESTYLE"],
                      ].map(([k,v,sec])=>v?.length?<span key={k} style={{fontSize:"0.66rem",letterSpacing:"0.1em",color:sectionColors[sec],border:`1px solid ${sectionColors[sec]}25`,borderRadius:"2px",padding:"0.12rem 0.57rem",background:`${sectionColors[sec]}07`,marginBottom:"0.42rem"}}>{k}: {v.join("+").toUpperCase()}</span>:null)}
                    </div>
                    {Object.entries(answers).some(([,v])=>v.comment?.trim())&&(
                      <div style={{marginTop:"0.62rem",paddingTop:"0.62rem",borderTop:`1px solid ${C.border}`}}>
                        {Object.entries(answers).filter(([,v])=>v.comment?.trim()).map(([id,v])=>(
                          <div key={id} style={{fontSize:"0.75rem",color:C.textMuted,lineHeight:1.5}}><span style={{color:C.textDim}}>#{id} note: </span>{v.comment}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{fontSize:"0.72rem",color:C.textDim,letterSpacing:"0.08em",lineHeight:1.6}}>
                    {t.recsExplainer}
                  </div>
                </div>

                {/* regime cards */}
                <div style={{display:"flex",flexDirection:"column",gap:"0.8rem",marginBottom:"1.33rem"}}>
                  {skinRecs.length>0&&<div style={{fontSize:"0.69rem",color:"#e8920a",letterSpacing:"0.18em",marginBottom:"0.5rem",marginTop:"0.5rem"}}>{t.skinRoutine}</div>}{skinRecs.map((rec,i)=><RecCard key={i} rec={rec} index={i} stepNum={i+1} t={t}/>)}{scalpRecs.length>0&&<div style={{fontSize:"0.69rem",color:"#55efc4",letterSpacing:"0.18em",marginBottom:"0.5rem",marginTop:"1.5rem"}}>{t.scalpRoutine}</div>}{scalpRecs.map((rec,i)=><RecCard key={"s"+i} rec={rec} index={i} stepNum={i+1} t={t}/>)}
                </div>

                {/* estimated total */}
                <div style={{padding:"0.6rem 0.9rem",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.33rem"}}>
                  <span style={{fontSize:"0.72rem",color:C.textMuted,letterSpacing:"0.10em"}}>{t.estimatedCost}</span>
                  <span style={{fontSize:"1.02rem",color:C.text,fontFamily:C.sans}}>
                    ${sortedRecs.reduce((sum,r)=>{const m=r.price?.match(/\$(\d+)/);return sum+(m?parseInt(m[1]):20);},0)}–${sortedRecs.reduce((sum,r)=>{const m=r.price?.match(/\$\d+–\$(\d+)/);return sum+(m?parseInt(m[1]):30);},0)}
                  </span>
                </div>

                {/* ── SAVE TO MEEMO PROFILE ── */}
                <div style={{border:`1px solid ${C.border}`,borderRadius:"4px",background:"#0d0d0d",padding:"1.1rem 1.33rem",marginBottom:"0.83rem",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"#a29bfe",boxShadow:"0 0 10px #a29bfe60"}}/>
                  <div style={{paddingLeft:"0.9rem"}}>
                    <div style={{fontSize:"0.72rem",color:"#a29bfe",letterSpacing:"0.2em",marginBottom:"0.57rem"}}>{t.saveProfile}</div>
                    <p style={{fontSize:"0.8rem",color:C.textMuted,lineHeight:1.6,marginBottom:"0.9rem"}}>{t.saveDesc}</p>
                    {!profileSaved?(
                      <div style={{display:"flex",flexDirection:"column",gap:"0.62rem"}}>
                        <input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder={t.saveName} style={{width:"100%",background:"#111",border:`1px solid ${profileName?"#a29bfe55":C.border}`,borderRadius:"3px",padding:"0.6rem 0.9rem",color:C.text,fontFamily:C.mono,fontSize:"0.88rem",outline:"none"}}/>
                        <input value={profileEmail} onChange={e=>setProfileEmail(e.target.value)} placeholder={t.saveEmail} type="email" style={{width:"100%",background:"#111",border:`1px solid ${profileEmail?"#a29bfe55":C.border}`,borderRadius:"3px",padding:"0.6rem 0.9rem",color:C.text,fontFamily:C.mono,fontSize:"0.88rem",outline:"none"}}/>
                        <button onClick={handleSaveProfile} disabled={!profileName.trim()&&!profileEmail.trim()} style={{background:"#a29bfe",color:"#000",border:"none",borderRadius:"3px",padding:"0.88rem",fontSize:"0.86rem",letterSpacing:"0.08em",cursor:"pointer",fontFamily:C.mono,fontWeight:500,opacity:(!profileName.trim()&&!profileEmail.trim())?0.35:1}}>
                          {t.saveBtn}
                        </button>
                      </div>
                    ):(
                      <div style={{display:"flex",alignItems:"center",gap:"0.72rem",padding:"0.6rem 0.9rem",background:"rgba(162,155,254,0.08)",border:"1px solid rgba(162,155,254,0.3)",borderRadius:"3px"}}>
                        <span style={{color:"#a29bfe"}}>✓</span>
                        <span style={{fontSize:"0.83rem",color:"#a29bfe"}}>Profile saved — welcome to Meemo, {profileName||profileEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── SMS DELIVERY ── */}
                <div style={{border:`1px solid ${C.border}`,borderRadius:"4px",background:"#0d0d0d",padding:"1.1rem 1.33rem",marginBottom:"0.83rem",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"#4ecdc4",boxShadow:"0 0 10px #4ecdc460"}}/>
                  <div style={{paddingLeft:"0.9rem"}}>
                    <div style={{fontSize:"0.72rem",color:"#4ecdc4",letterSpacing:"0.2em",marginBottom:"0.57rem"}}>{t.textRegime}</div>
                    <p style={{fontSize:"0.8rem",color:C.textMuted,lineHeight:1.6,marginBottom:"0.9rem"}}>{t.textDesc}</p>
                    {!smsSent?(
                      <div style={{display:"flex",gap:"0.62rem"}}>
                        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder={t.textPhone} type="tel" style={{flex:1,background:"#111",border:`1px solid ${phone?"#4ecdc455":C.border}`,borderRadius:"3px",padding:"0.6rem 0.9rem",color:C.text,fontFamily:C.mono,fontSize:"0.88rem",outline:"none"}}/>
                        <button onClick={handleSMS} disabled={!phone.trim()} style={{background:"#4ecdc4",color:"#000",border:"none",borderRadius:"3px",padding:"0.6rem 1.1rem",fontSize:"0.86rem",letterSpacing:"0.06em",cursor:"pointer",fontFamily:C.mono,fontWeight:500,flexShrink:0,opacity:!phone.trim()?0.35:1}}>
                          {t.textSend}
                        </button>
                      </div>
                    ):(
                      <div style={{display:"flex",alignItems:"center",gap:"0.72rem",padding:"0.6rem 0.9rem",background:"rgba(78,205,196,0.08)",border:"1px solid rgba(78,205,196,0.3)",borderRadius:"3px"}}>
                        <span style={{color:"#4ecdc4"}}>✓</span>
                        <span style={{fontSize:"0.83rem",color:"#4ecdc4"}}>Opening SMS app — paste your regime and hit send</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── COPY + EMAIL ── */}
                <div style={{borderTop:`1px solid ${C.border}`,paddingTop:"1.33rem",marginBottom:"1.33rem"}}>
                  <div style={{fontSize:"0.72rem",color:C.amber,letterSpacing:"0.2em",marginBottom:"0.9rem"}}>{t.savePlusShare}</div>
                  <div style={{display:"flex",gap:"0.67rem",marginBottom:"0.9rem"}}>
                    <button onClick={handleCopy} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.52rem",padding:"0.85rem 0.72rem",background:copied?"rgba(78,205,196,0.08)":"rgba(232,146,10,0.07)",border:`1px solid ${copied?"#4ecdc4":C.amber}`,borderRadius:"3px",cursor:"pointer",fontFamily:C.mono,transition:"all 0.2s"}}>
                      <span style={{fontSize:"1.2rem",lineHeight:1}}>{copied?"✓":"⎘"}</span>
                      <span style={{fontSize:"0.72rem",color:copied?"#4ecdc4":C.amber,letterSpacing:"0.1em"}}>{copied?"COPIED!":"COPY"}</span>
                    </button>
                    <a href={`mailto:?subject=${encodeURIComponent("My Meemo Korean Beauty Skin Protocol")}&body=${encodeURIComponent(buildText(sortedRecs,answers))}`}
                      style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.52rem",padding:"0.85rem 0.72rem",background:"transparent",border:`1px solid ${C.border}`,borderRadius:"3px",cursor:"pointer",fontFamily:C.mono,transition:"all 0.15s",textDecoration:"none"}}>
                      <span style={{fontSize:"1.2rem",lineHeight:1,color:C.textMuted}}>✉</span>
                      <span style={{fontSize:"0.72rem",color:C.textMuted,letterSpacing:"0.1em"}}>{t.emailLabel}</span>
                    </a>
                  </div>
                  <div style={{fontSize:"0.7rem",color:C.textDim,letterSpacing:"0.10em",marginBottom:"0.57rem"}}>{t.textPreview}</div>
                  <textarea ref={shareRef} readOnly value={buildText(sortedRecs,answers)} rows={5} onClick={e=>e.target.select()}
                    style={{width:"100%",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px",padding:"0.65rem 0.97rem",color:C.textMuted,fontFamily:C.mono,fontSize:"0.73rem",lineHeight:1.75,resize:"none",outline:"none",cursor:"text"}}/>
                </div>

                <button onClick={restart} style={{...ghostBtn,width:"100%",textAlign:"center"}}>{t.restart}</button>

                {/* ── LEGAL: disclaimer + privacy ── */}
                <div style={{marginTop:"1.33rem",padding:"0.85rem 1rem",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px"}}>
                  <div style={{fontSize:"0.66rem",color:C.textMuted,letterSpacing:"0.16em",marginBottom:"0.5rem"}}>{t.legalTitle}</div>
                  <p style={{fontSize:"0.7rem",color:C.textDim,lineHeight:1.7}}>{t.legalBody}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",marginTop:"1.3rem",fontSize:"0.72rem",color:C.textDim,letterSpacing:"0.14em"}}>
          <span>{t.footerLeft}</span><span>{t.footerRight}</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        textarea::placeholder{color:#2a2520;}
        textarea{color-scheme:dark;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
    </div>
  );
}
