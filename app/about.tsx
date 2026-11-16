import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SiteFooter, SiteHeader } from "../components/SiteShell";
import { useSiteSettings } from "../hooks/useSiteSettings";

export default function AboutScreen() {
  const settings = useSiteSettings();
  return (
    <View style={styles.page}>
      <SiteHeader active="about" />
      <ScrollView>
        <View style={styles.hero}><Text style={styles.kicker}>ABOUT KHADAMATI</Text><Text style={styles.title}>من نحن</Text><Text style={styles.lead}>{settings.aboutText}</Text></View>
        <View style={styles.content}>
          <View style={styles.card}><Text style={styles.heading}>فكرتنا</Text><Text style={styles.body}>بدلًا من البحث في أماكن متعددة، تساعدك خدماتي على اكتشاف مجموعة من الخدمات الرئيسية والمميزة، والاطلاع على وصف كل خدمة وتفاصيلها من مكان واحد.</Text></View>
          <View style={styles.card}><Text style={styles.heading}>رؤيتنا</Text><Text style={styles.body}>تقديم تجربة منظمة لعرض الخدمات والوصول إليها بسهولة عبر الويب وتطبيقات Android وiOS.</Text></View>
          <View style={styles.card}><Text style={styles.heading}>ماذا نقدم؟</Text><Text style={styles.body}>أقسام متنوعة تشمل الكهرباء والسباكة والنجارة والتنظيف والتكييف والتشطيبات، إلى جانب خدمات إضافية تلبي احتياجات المنزل والعمل.</Text></View>
        </View>
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7F9FF" },
  hero: { backgroundColor: "#EAF0FF", paddingHorizontal: 24, paddingVertical: 58, alignItems: "center" },
  kicker: { color: "#0738C8", fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#10245F", fontSize: 34, fontWeight: "900", marginTop: 10 },
  lead: { maxWidth: 650, color: "#63777A", fontSize: 15, lineHeight: 27, textAlign: "center", marginTop: 12 },
  content: { width: "100%", maxWidth: 980, alignSelf: "center", padding: 24, gap: 16, marginVertical: 20 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E1E8F8", padding: 24 },
  heading: { color: "#10245F", fontSize: 19, fontWeight: "900", textAlign: "right" },
  body: { color: "#607278", fontSize: 14, lineHeight: 27, textAlign: "right", marginTop: 10 }
});
