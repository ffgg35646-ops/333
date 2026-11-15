import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>خ</Text>
        </View>
        <Text style={styles.title}>خدماتي</Text>
        <Text style={styles.subtitle}>كل خدماتك في مكان واحد</Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>البيئة جاهزة للانطلاق</Text>
          <Text style={styles.statusText}>
            تم تجهيز الأساس التقني للويب وAndroid وiOS. سنضيف الخدمات والواجهات
            والوظائف حسب متطلبات المشروع.
          </Text>
        </View>
        <Text style={styles.footer}>KHADAMATI · WEB · ANDROID · IOS</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6F8"
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40
  },
  brandMark: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#172B4D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  brandMarkText: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800"
  },
  title: {
    color: "#172B4D",
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center"
  },
  subtitle: {
    color: "#68778D",
    fontSize: 17,
    marginTop: 8,
    textAlign: "center"
  },
  statusCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    marginTop: 36,
    borderWidth: 1,
    borderColor: "#E5EAF0"
  },
  statusTitle: {
    color: "#172B4D",
    fontSize: 19,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 10
  },
  statusText: {
    color: "#68778D",
    fontSize: 15,
    lineHeight: 27,
    textAlign: "right"
  },
  footer: {
    color: "#9AA5B5",
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 36
  }
});
