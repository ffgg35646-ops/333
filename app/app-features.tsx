import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { SiteFooter, SiteHeader } from "../components/SiteShell";
import { allServices, serviceCategories } from "../data/services";

const overview = [
  { title: "نظافة منزلية", icon: "✦", items: ["إبادة حشرات", "تعقيم", "سجاد وأرضيات", "جمع القمامة"] },
  { title: "صيانة وتشطيبات", icon: "🔧", items: ["نجارة", "سباكة", "نقاشة", "ألومنيوم", "كهرباء", "أسقف معلقة", "ديكور"] },
  { title: "مكواة ومغسلة", icon: "👔", items: ["غسيل وكي جميع الملابس", "رفا", "صبغة"] },
  { title: "ماركت", icon: "🛒", items: ["مواد غذائية بجميع أنواعها"] },
  { title: "طعام ومطاعم", icon: "🍽️", items: ["مطاعم محيطة ومقدمو الطعام القريبون"] },
  { title: "رعاية الحيوانات", icon: "🐾", items: ["أكل للحيوانات", "رعاية صحية", "إكسسوارات"] }
];

const quick = [
  { code: "A", title: "دليفري", icon: "🛵", description: "الوصول السريع إلى المطاعم والسوبر ماركت والخضروات والفواكه والبقالة." , items: ["مطاعم", "سوبر ماركت", "خضروات", "فواكه", "بقالة"] },
  { code: "B", title: "خدمة بسرعة", icon: "⚡", description: "طلب توصيل سريع بليموزين أو موتوسيكل لنقل الأشخاص أو الأوراق والطلبات العاجلة.", items: ["ليموزين", "موتوسيكل", "نقل أشخاص", "توصيل أوراق"] },
  { code: "C", title: "احجز تذكرتك", icon: "🎟️", description: "استعراض خدمات حجز التذاكر المحلية والدولية.", items: ["قطارات", "أتوبيسات", "طيران محلي", "طيران دولي"] },
  { code: "D", title: "خدمة الصيدلية", icon: "💊", description: "واجهة مخصصة للصيدلية ترتبط بتطبيق الصيدلية المستقل عند تفعيل الربط.", items: ["تصوير الروشتة", "طلب دواء", "استفسار صيدلي"] }
];

const extended = [
  { number: "01", title: "الصيانة", groups: [
    { name: "الصيانة المنزلية", items: ["سباكة", "كهرباء", "نجارة", "صيانة الأجهزة المنزلية"] },
    { name: "الصيانة الدورية", items: ["التكييف", "فلاتر المياه"] },
    { name: "الصيانة الإلكترونية", items: ["الموبايل", "اللابتوب", "الكمبيوتر", "ويندوز", "بلاي ستيشن"] }
  ]},
  { number: "02", title: "النظافة والتعقيم", groups: [
    { name: "النظافة المنزلية", items: ["تنظيف المنازل", "رش المبيدات الحشرية", "التعقيم"] },
    { name: "دراي كلين", items: ["غسيل الملابس", "غسيل السجاد", "تنظيف الأثاث المنزلي", "الكي بالبخار"] }
  ]},
  { number: "03", title: "خدمات السيارات", groups: [
    { name: "خدمات المركبات", items: ["تجديد التراخيص", "حل مشكلات المرور", "اطلب ميكانيكي", "سيارات إنقاذ", "اشتراك نظافة دوري"] }
  ]},
  { number: "04", title: "الشحن والنقل الخاص", groups: [
    { name: "خيارات النقل", items: ["نقل بالحراسة", "نقل VIP", "نقل عادي", "توصيل الطرود", "النقل البريدي"] }
  ]},
  { number: "05", title: "خدمات الحفلات", groups: [
    { name: "التجهيز والتنظيم", items: ["تجهيز عزومات", "تجهيز أعياد الميلاد", "تنظيم حفلات الزفاف", "جميع المناسبات"] }
  ]},
  { number: "06", title: "الخدمات الترفيهية", groups: [
    { name: "الحجوزات والرحلات", items: ["تذاكر كرة القدم", "تذاكر المسرحيات والمصايف", "رحلات بحرية وصيد", "رحلات الملاهي والسفاري"] }
  ]},
  { number: "07", title: "الحيوانات الأليفة", groups: [
    { name: "رعاية متكاملة", items: ["طعام الحيوانات", "رعاية بيطرية", "خدمات ترفيه"] }
  ]},
  { number: "08", title: "الدفع وتحويل الأموال", groups: [
    { name: "الخدمات المالية", items: ["دفع الفواتير", "دفع الاشتراكات", "شحن الموبايل والإنترنت", "تحويل الأموال بنظام المحفظة"] }
  ]}
];

const pharmacy = [
  { title: "تصوير الروشتة", description: "زر كاميرا لفتح الكاميرا وتصوير الروشتة وإرسالها للصيدلية." },
  { title: "طلب وحجز خاص", description: "إرسال طلب دواء أو حجز خاص ومتابعة الطلب." },
  { title: "الخدمات الطبية", description: "طلب حضور طبيب، حجز عيادة، والتصفح حسب التخصصات الطبية." },
  { title: "الأشعة والتحاليل", description: "حجز أشعة أو تحاليل واستعراض مراكز الأشعة والتحاليل." },
  { title: "المراسلة", description: "مربع مراسلة للاستفسار أو طلب دواء والتواصل مع الصيدلية." },
  { title: "قوائم قابلة للتوسع", description: "إمكانية إضافة قوائم وخدمات جديدة للصيدلية لاحقًا." }
];

function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return <View style={styles.sectionTitle}><Text style={styles.kicker}>{kicker}</Text><Text style={styles.heading}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text></View>;
}

export default function AppFeaturesScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 720;
  return (
    <View style={styles.page}>
      <SiteHeader active="features" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>KHADAMATI · APP OVERVIEW</Text>
          <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>كل احتياجاتك اليومية في تطبيق واحد</Text>
          <Text style={styles.heroText}>نتشرف بتقديم عرض مبسط لتطبيق يقدم عدة خدمات في تطبيق واحد، لتسهيل الوصول إلى الخدمات والطلبات والحجوزات من مكان واحد.</Text>
          <Pressable onPress={() => router.push("/request-service" as never)} style={styles.heroButton}><Text style={styles.heroButtonText}>اطلب خدمة الآن ←</Text></Pressable>
        </View>

        <View style={styles.section}>
          <SectionTitle kicker="OVERVIEW" title="الخدمات الأساسية" subtitle="مجموعة متنوعة من الخدمات التي يمكن الوصول إليها من خلال منصة خدماتي." />
          <View style={styles.grid}>
            {overview.map((item, index) => <View key={item.title} style={[styles.overviewCard, { width: compact ? "100%" : "31.5%" }]}><Text style={styles.cardIcon}>{item.icon}</Text><Text style={styles.cardTitle}>{index + 1}. {item.title}</Text><View style={styles.chips}>{item.items.map(value => <Text key={value} style={styles.chip}>{value}</Text>)}</View></View>)}
          </View>
        </View>

        {serviceCategories.map(category => {
          const items = allServices.filter(item => item.categoryId === category.id);
          return <View key={category.id} style={styles.section}>
            <SectionTitle kicker={category.english} title={category.title} subtitle={`${items.length} خدمة متاحة باللغتين العربية والإنجليزية.`} />
            <View style={styles.mainServicesGrid}>
              {items.map((item, index) => <View key={item.id} style={[styles.mainServiceCard, { width: compact ? "100%" : "23.5%" }]}>
                <Text style={styles.mainServiceNumber}>{String(index + 1).padStart(2, "0")}</Text>
                <Text style={styles.mainServiceArabic}>{item.title}</Text>
                <Text style={styles.mainServiceEnglish}>{item.english}</Text>
              </View>)}
            </View>
          </View>;
        })}

        <View style={styles.quickSection}>
          <View style={styles.section}>
            <SectionTitle kicker="QUICK ACCESS A–D" title="الواجهة الافتتاحية والوصول السريع" subtitle="أيقونات مختصرة للخدمات الأكثر استخدامًا لتسهيل الوصول إليها." />
            <View style={styles.grid}>
              {quick.map(item => <View key={item.code} style={[styles.quickCard, { width: compact ? "100%" : "48%" }]}>
                <View style={styles.quickHead}><View style={styles.quickCode}><Text style={styles.quickCodeText}>{item.code}</Text></View><Text style={styles.quickIcon}>{item.icon}</Text></View>
                <Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.cardDescription}>{item.description}</Text>
                <View style={styles.chips}>{item.items.map(value => <Text key={value} style={styles.chip}>{value}</Text>)}</View>
              </View>)}
            </View>
            <View style={styles.emergency}>
              <Text style={styles.emergencyIcon}>!</Text>
              <View style={styles.emergencyCopy}><Text style={styles.emergencyTitle}>زر الطوارئ الأحمر · خدمة VIP</Text><Text style={styles.emergencyText}>خدمة خاصة بالاشتراك، مرتبطة برقم هاتف مخصص، مع كول سنتر لمتابعة طلبات الطوارئ والطلبات الخاصة. يتم تفعيلها بعد تجهيز رقم الخدمة وفريق الاستجابة.</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle kicker="EXTENDED CATALOG 1–2–3" title="قائمة الخدمات الموسعة" subtitle="أقسام رئيسية وفرعية قابلة للزيادة وإضافة خدمات وعروض جديدة بمرور الوقت." />
          <View style={styles.extendedGrid}>
            {extended.map(section => <View key={section.number} style={[styles.extendedCard, { width: compact ? "100%" : "48%" }]}>
              <View style={styles.extendedHead}><Text style={styles.number}>{section.number}</Text><Text style={styles.extendedTitle}>{section.title}</Text></View>
              {section.groups.map(group => <View key={group.name} style={styles.subGroup}><Text style={styles.subGroupTitle}>{group.name}</Text><View style={styles.bulletList}>{group.items.map(item => <Text key={item} style={styles.bullet}>• {item}</Text>)}</View></View>)}
            </View>)}
          </View>
          <View style={styles.futureBox}><Text style={styles.futureTitle}>قابلية التوسع وإضافة أقسام جديدة</Text><Text style={styles.futureText}>يمكن إضافة قوائم أخرى مثل العروض التجارية، الإكسسوارات، المكياج، الأدوات المنزلية، وأي خدمات جديدة حسب احتياج العملاء.</Text></View>
        </View>

        <View style={styles.pharmacySection}>
          <View style={styles.section}>
            <SectionTitle kicker="PHARMACY EXPERIENCE" title="واجهة تطبيق الصيدلية" subtitle="واجهة مستقلة للخدمات الصيدلية والطبية، مع إمكانية الربط بالتطبيق المستقل للصيدلية." />
            <View style={styles.pharmacyGrid}>
              {pharmacy.map((item, index) => <View key={item.title} style={[styles.pharmacyCard, { width: compact ? "100%" : "31.5%" }]}><Text style={styles.pharmacyNumber}>0{index + 1}</Text><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.cardDescription}>{item.description}</Text></View>)}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.contactPanel}>
            <Text style={styles.contactTitle}>التواصل والدعم في جميع الخدمات</Text>
            <Text style={styles.contactText}>يتضمن تصور التطبيق إمكانية مراسلة الكول سنتر والتصوير وإرفاق الصور مع الطلبات، مع إمكانية إضافة قوائم وخدمات أخرى مستقبلًا.</Text>
            <Text style={styles.contactNote}>ملاحظة: هذه الصفحة تعرض نطاق الخدمات والتصور المقترح. خدمات الحجز والدفع والمحفظة والصيدلية والطوارئ تحتاج إلى ربط مزودي الخدمة والأنظمة وأرقام التواصل قبل تشغيلها فعليًا.</Text>
          </View>
        </View>
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F8F7" },
  hero: { backgroundColor: "#102A34", paddingHorizontal: 26, paddingVertical: 68, alignItems: "center" },
  heroKicker: { color: "#9BD9CE", fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  heroTitle: { color: "#FFFFFF", fontSize: 39, lineHeight: 54, fontWeight: "900", textAlign: "center", marginTop: 15, maxWidth: 850 },
  heroTitleCompact: { fontSize: 29, lineHeight: 42 },
  heroText: { color: "#D3E0E1", fontSize: 15, lineHeight: 29, textAlign: "center", maxWidth: 760, marginTop: 14 },
  heroButton: { backgroundColor: "#07877B", paddingHorizontal: 22, paddingVertical: 14, borderRadius: 12, marginTop: 25 },
  heroButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },
  section: { width: "100%", maxWidth: 1200, alignSelf: "center", paddingHorizontal: 24, paddingVertical: 48 },
  sectionTitle: { marginBottom: 25, alignItems: "center" },
  kicker: { color: "#07877B", fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  heading: { color: "#102A34", fontSize: 27, fontWeight: "900", textAlign: "center", marginTop: 8 },
  subtitle: { color: "#687B80", fontSize: 13, lineHeight: 23, textAlign: "center", marginTop: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 14 },
  overviewCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5ECE8", borderRadius: 17, padding: 19, minHeight: 175 },
  cardIcon: { fontSize: 25, marginBottom: 10 },
  cardTitle: { color: "#17343D", fontSize: 16, fontWeight: "900", textAlign: "right" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 13, justifyContent: "flex-start" },
  chip: { color: "#35615C", backgroundColor: "#EAF4F0", borderRadius: 20, overflow: "hidden", paddingHorizontal: 10, paddingVertical: 6, fontSize: 11, fontWeight: "700" },
  mainServicesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
  mainServiceCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E3EBE6", borderRadius: 15, padding: 16, minHeight: 112, justifyContent: "center" },
  mainServiceNumber: { color: "#0A897D", fontSize: 10, fontWeight: "900", textAlign: "right", marginBottom: 8 },
  mainServiceArabic: { color: "#17343D", fontSize: 16, fontWeight: "900", textAlign: "right" },
  mainServiceEnglish: { color: "#718187", fontSize: 11, fontWeight: "700", textAlign: "right", marginTop: 5 },
  premiumSection: { backgroundColor: "#EDF4F1" },
  premiumGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
  premiumCard: { backgroundColor: "#FFFFFF", borderRadius: 13, borderWidth: 1, borderColor: "#E1EAE5", padding: 15, flexDirection: "row", alignItems: "center", gap: 11, minHeight: 64 },
  premiumCheck: { width: 25, height: 25, borderRadius: 13, backgroundColor: "#E7F4EF", alignItems: "center", justifyContent: "center" },
  premiumCheckText: { color: "#07877B", fontSize: 14, fontWeight: "900" },
  premiumText: { flex: 1, color: "#25434A", fontSize: 13, fontWeight: "700", textAlign: "right", lineHeight: 21 },
  quickSection: { backgroundColor: "#EDF4F1" },
  quickCard: { backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E1EAE5", padding: 20, minHeight: 220 },
  quickHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 13 },
  quickCode: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#102A34", alignItems: "center", justifyContent: "center" },
  quickCodeText: { color: "#FFFFFF", fontSize: 17, fontWeight: "900" },
  quickIcon: { fontSize: 28 },
  cardDescription: { color: "#64787D", fontSize: 12, lineHeight: 22, textAlign: "right", marginTop: 8 },
  emergency: { backgroundColor: "#FFF0EF", borderWidth: 1, borderColor: "#F5D2CF", borderRadius: 16, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, marginTop: 22 },
  emergencyIcon: { width: 42, height: 42, borderRadius: 21, overflow: "hidden", textAlign: "center", textAlignVertical: "center", backgroundColor: "#D92D20", color: "#FFFFFF", fontSize: 25, fontWeight: "900" },
  emergencyCopy: { flex: 1 },
  emergencyTitle: { color: "#9B2822", fontSize: 15, fontWeight: "900", textAlign: "right" },
  emergencyText: { color: "#80514E", fontSize: 12, lineHeight: 22, textAlign: "right", marginTop: 5 },
  extendedGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 15 },
  extendedCard: { backgroundColor: "#FFFFFF", borderRadius: 17, borderWidth: 1, borderColor: "#E5ECE8", padding: 19 },
  extendedHead: { flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: 1, borderBottomColor: "#EAF0EC", paddingBottom: 13, marginBottom: 12 },
  number: { color: "#07877B", fontSize: 12, fontWeight: "900", backgroundColor: "#EAF4F0", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  extendedTitle: { color: "#17343D", fontSize: 17, fontWeight: "900", textAlign: "right", flex: 1 },
  subGroup: { marginTop: 9 },
  subGroupTitle: { color: "#087D73", fontSize: 12, fontWeight: "900", textAlign: "right", marginBottom: 6 },
  bulletList: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  bullet: { color: "#63777A", fontSize: 12, backgroundColor: "#F5F8F6", borderRadius: 7, paddingHorizontal: 9, paddingVertical: 6 },
  futureBox: { marginTop: 20, backgroundColor: "#E8F3EF", borderRadius: 15, padding: 19 },
  futureTitle: { color: "#174B48", fontSize: 15, fontWeight: "900", textAlign: "right" },
  futureText: { color: "#54716D", fontSize: 13, lineHeight: 24, textAlign: "right", marginTop: 7 },
  pharmacySection: { backgroundColor: "#F0F4F7" },
  pharmacyGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 14 },
  pharmacyCard: { backgroundColor: "#FFFFFF", borderRadius: 15, padding: 18, borderWidth: 1, borderColor: "#E3E9ED", minHeight: 150 },
  pharmacyNumber: { color: "#07877B", fontSize: 11, fontWeight: "900", marginBottom: 10 },
  contactPanel: { backgroundColor: "#102A34", borderRadius: 20, padding: 25 },
  contactTitle: { color: "#FFFFFF", fontSize: 21, fontWeight: "900", textAlign: "right" },
  contactText: { color: "#D3E0E1", fontSize: 13, lineHeight: 25, textAlign: "right", marginTop: 10 },
  contactNote: { color: "#A9C6C5", fontSize: 11, lineHeight: 21, textAlign: "right", marginTop: 15 }
});
