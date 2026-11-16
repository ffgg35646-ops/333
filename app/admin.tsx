import { useEffect, useMemo, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { apiRequest, clearAdminToken } from "../lib/api";
import { allServices } from "../data/services";
import type { ServiceGroup, ServiceItem } from "../data/services";

type Tab = "services" | "requests" | "settings";
type AdminRequest = { id: string; name: string; phone: string; address: string; service: string; notes?: string; status: string; createdAt?: string };

export default function AdminScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 860;
  const [items, setItems] = useState<ServiceItem[]>(allServices);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [requests, setRequests] = useState<AdminRequest[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await apiRequest("/api/admin/me", {}, true);
        const result = await apiRequest<{ services: ServiceItem[] }>("/api/services");
        if (alive && result.services) setItems(result.services);
        const requestResult = await apiRequest<{ requests: AdminRequest[] }>("/api/requests", {}, true);
        if (alive) setRequests(requestResult.requests || []);
      } catch (error) {
        await clearAdminToken();
        if (alive) router.replace("/admin-login" as never);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  const [tab, setTab] = useState<Tab>("services");
  const [filter, setFilter] = useState<"all" | ServiceGroup>("all");
  const [draft, setDraft] = useState<ServiceItem | null>(null);
  const [search, setSearch] = useState("");
  const visibleItems = useMemo(() => items.filter(item => (filter === "all" || item.group === filter) && (item.title.includes(search) || item.english.toLowerCase().includes(search.toLowerCase()))), [items, filter, search]);

  const openNew = (group: ServiceGroup) => setDraft({ id: "new-" + Date.now(), title: "", english: "", shortDescription: "", details: "", image: "", group, icon: "✦" });
  const updateDraft = <K extends keyof ServiceItem,>(key: K, value: ServiceItem[K]) => setDraft(current => current ? { ...current, [key]: value } : current);
  const saveDraft = async () => {
    if (!draft || !draft.title.trim()) return;
    setApiError("");
    try {
      const exists = items.some(item => item.id === draft.id);
      if (exists) {
        await apiRequest(`/api/services/${encodeURIComponent(draft.id)}`, { method: "PUT", body: JSON.stringify(draft) }, true);
        setItems(current => current.map(item => item.id === draft.id ? draft : item));
      } else {
        await apiRequest("/api/services", { method: "POST", body: JSON.stringify(draft) }, true);
        setItems(current => [draft, ...current]);
      }
      setDraft(null);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "تعذر حفظ الخدمة.");
    }
  };
  const removeItem = async (id: string) => {
    setApiError("");
    try {
      await apiRequest(`/api/services/${encodeURIComponent(id)}`, { method: "DELETE" }, true);
      setItems(current => current.filter(item => item.id !== id));
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "تعذر حذف الخدمة.");
    }
  };
  const updateRequestStatus = async (id: string, status: string) => {
    try {
      await apiRequest(`/api/requests/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify({ status }) }, true);
      setRequests(current => current.map(item => item.id === id ? { ...item, status } : item));
    } catch (error) { setApiError(error instanceof Error ? error.message : "تعذر تحديث حالة الطلب."); }
  };
  const deleteRequest = async (id: string) => {
    try {
      await apiRequest(`/api/requests/${encodeURIComponent(id)}`, { method: "DELETE" }, true);
      setRequests(current => current.filter(item => item.id !== id));
    } catch (error) { setApiError(error instanceof Error ? error.message : "تعذر حذف الطلب."); }
  };
  const logout = async () => {
    await clearAdminToken();
    router.replace("/admin-login" as never);
  };

  const MenuButton = ({ value, label, icon }: { value: Tab; label: string; icon: string }) => (
    <Pressable onPress={() => setTab(value)} style={[styles.menuButton, tab === value && styles.menuButtonActive]}>
      <Text style={[styles.menuIcon, tab === value && styles.menuTextActive]}>{icon}</Text>
      <Text style={[styles.menuText, tab === value && styles.menuTextActive]}>{label}</Text>
      {tab === value && <View style={styles.menuIndicator} />}
    </Pressable>
  );

  return (
    <View style={styles.page}>
      <View style={[styles.layout, compact && styles.layoutCompact]}>
        <View style={[styles.sidebar, compact && styles.sidebarCompact]}>
          <Pressable onPress={() => router.push("/" as never)} style={styles.brand}>
            <View style={styles.logo}><Text style={styles.logoText}>خ</Text></View>
            <View><Text style={styles.brandName}>خدماتي</Text><Text style={styles.brandSub}>ADMIN PANEL</Text></View>
          </Pressable>
          {!compact && <Text style={styles.menuCaption}>القائمة الرئيسية</Text>}
          <View style={[styles.menu, compact && styles.menuCompact]}>
            <MenuButton value="services" label="إدارة الخدمات" icon="▦" />
            <MenuButton value="requests" label="طلبات الخدمة" icon="▤" />
            <MenuButton value="settings" label="الإعدادات" icon="⚙" />
          </View>
          <View style={styles.sidebarBottom}>
            <View style={styles.adminAvatar}><Text style={styles.avatarText}>A</Text></View>
            <View style={{ flex: 1 }}><Text style={styles.adminName}>مدير المنصة</Text><Text style={styles.adminRole}>معاينة لوحة الإدارة</Text></View>
            <Pressable onPress={logout}><Text style={styles.logout}>↪</Text></Pressable>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.topbar}>
            <View><Text style={styles.pageKicker}>KHADAMATI / ADMIN</Text><Text style={styles.pageTitle}>{tab === "services" ? "إدارة الخدمات" : tab === "requests" ? "طلبات الخدمة" : "إعدادات المنصة"}</Text></View>
            <View style={styles.topActions}>
              <View style={styles.previewBadge}><View style={styles.previewDot} /><Text style={styles.previewBadgeText}>متصل بقاعدة البيانات</Text></View>
              <Pressable onPress={() => router.push("/" as never)} style={styles.siteButton}><Text style={styles.siteButtonText}>عرض الموقع ↗</Text></Pressable>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {tab === "services" && (
              <>
                <View style={styles.welcome}><View><Text style={styles.welcomeTitle}>أهلًا بك في لوحة خدماتي 👋</Text><Text style={styles.welcomeText}>نظّم أقسام الخدمات والصور والتفاصيل من مكان واحد.</Text></View><Text style={styles.welcomePattern}>✦</Text></View>
                <View style={styles.stats}>
                  <View style={styles.statCard}><Text style={styles.statLabel}>إجمالي الأقسام</Text><Text style={styles.statValue}>{items.length}</Text><Text style={styles.statFoot}>رئيسية ومميزة</Text></View>
                  <View style={styles.statCard}><Text style={styles.statLabel}>الخدمات الرئيسية</Text><Text style={styles.statValue}>{items.filter(item => item.group === "main").length}</Text><Text style={styles.statFoot}>قسم أساسي</Text></View>
                  <View style={styles.statCard}><Text style={styles.statLabel}>الخدمات المميزة</Text><Text style={styles.statValue}>{items.filter(item => item.group === "featured").length}</Text><Text style={styles.statFoot}>قسم إضافي</Text></View>
                  <View style={styles.statCard}><Text style={styles.statLabel}>طلبات جديدة</Text><Text style={styles.statValue}>—</Text><Text style={styles.statFoot}>بانتظار ربط الطلبات</Text></View>
                </View>
                <View style={styles.sectionHead}>
                  <View><Text style={styles.sectionTitle}>أقسام الخدمات</Text><Text style={styles.sectionSub}>أضف قسمًا أو عدّل الصورة والنص والتفاصيل.</Text></View>
                  <View style={styles.addActions}>
                    <Pressable onPress={() => openNew("main")} style={styles.addButton}><Text style={styles.addButtonText}>＋ قسم رئيسي</Text></Pressable>
                    <Pressable onPress={() => openNew("featured")} style={styles.addButtonOutline}><Text style={styles.addButtonOutlineText}>＋ خدمة مميزة</Text></Pressable>
                  </View>
                </View>
                <TextInput value={search} onChangeText={setSearch} placeholder="ابحث باسم الخدمة..." placeholderTextColor="#9BA8A9" style={styles.search} />
                <View style={styles.filters}>
                  {([{ key: "all", label: "الكل" }, { key: "main", label: "الخدمات الرئيسية" }, { key: "featured", label: "الخدمات المميزة" }] as const).map(option => (
                    <Pressable key={option.key} onPress={() => setFilter(option.key)} style={[styles.filterButton, filter === option.key && styles.filterButtonActive]}><Text style={[styles.filterText, filter === option.key && styles.filterTextActive]}>{option.label}</Text></Pressable>
                  ))}
                </View>
                <View style={styles.serviceGrid}>
                  {visibleItems.map(item => (
                    <View key={item.id} style={styles.serviceCard}>
                      <Image source={{ uri: item.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80" }} style={styles.serviceImage} />
                      <View style={styles.serviceCardBody}>
                        <View style={styles.serviceCardHead}><Text style={styles.serviceName}>{item.icon} {item.title}</Text><Text style={styles.groupTag}>{item.group === "main" ? "رئيسية" : "مميزة"}</Text></View>
                        <Text style={styles.serviceEnglish}>{item.english}</Text>
                        <Text style={styles.serviceDescription} numberOfLines={2}>{item.shortDescription}</Text>
                        <View style={styles.cardActions}>
                          <Pressable onPress={() => setDraft(item)} style={styles.editButton}><Text style={styles.editText}>تعديل</Text></Pressable>
                          <Pressable onPress={() => removeItem(item.id)} style={styles.deleteButton}><Text style={styles.deleteText}>حذف</Text></Pressable>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {tab === "requests" && (
              <View style={{ gap: 14 }}>
                <View style={styles.welcome}><View><Text style={styles.welcomeTitle}>طلبات العملاء</Text><Text style={styles.welcomeText}>تابع الطلبات الجديدة وغيّر حالتها من مكان واحد.</Text></View><Text style={styles.welcomePattern}>▤</Text></View>
                {requests.length === 0 ? <View style={styles.emptyState}><Text style={styles.emptyIcon}>▤</Text><Text style={styles.emptyTitle}>لا توجد طلبات حتى الآن</Text><Text style={styles.emptyText}>ستظهر هنا الطلبات التي يرسلها العملاء من الموقع.</Text></View> :
                  requests.map(item => (
                    <View key={item.id} style={{ backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E6ECE9", borderRadius: 15, padding: 16, gap: 8 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <Text style={{ color: "#17383D", fontWeight: "900", fontSize: 15 }}>{item.service}</Text>
                        <Text style={{ color: "#07877B", fontSize: 11, fontWeight: "800" }}>{({new:"جديد",contacted:"تم التواصل",in_progress:"قيد التنفيذ",completed:"مكتمل",cancelled:"ملغي"} as Record<string,string>)[item.status] || item.status}</Text>
                      </View>
                      <Text style={{ color: "#415A60", textAlign: "right" }}>العميل: {item.name} · الهاتف: {item.phone}</Text>
                      <Text style={{ color: "#667B7E", textAlign: "right" }}>العنوان: {item.address}</Text>
                      {!!item.notes && <Text style={{ color: "#667B7E", textAlign: "right" }}>التفاصيل: {item.notes}</Text>}
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7, justifyContent: "flex-end", marginTop: 5 }}>
                        {([{v:"contacted",t:"تم التواصل"},{v:"in_progress",t:"قيد التنفيذ"},{v:"completed",t:"مكتمل"},{v:"cancelled",t:"إلغاء"}]).map(x => <Pressable key={x.v} onPress={() => updateRequestStatus(item.id,x.v)} style={{ backgroundColor: item.status===x.v ? "#DDF3EC" : "#F2F6F4", paddingVertical:8, paddingHorizontal:10, borderRadius:8 }}><Text style={{ color:"#315B58", fontSize:10, fontWeight:"800" }}>{x.t}</Text></Pressable>)}
                        <Pressable onPress={() => deleteRequest(item.id)} style={{ backgroundColor:"#FCEEEE",paddingVertical:8,paddingHorizontal:10,borderRadius:8 }}><Text style={{ color:"#A33B3B",fontSize:10,fontWeight:"800" }}>حذف</Text></Pressable>
                      </View>
                    </View>
                  ))
                }
              </View>
            )}
            {tab === "settings" && (
              <View style={styles.settingsCard}><Text style={styles.sectionTitle}>إعدادات المنصة</Text><Text style={styles.settingsText}>سيتم توصيل إعدادات الحسابات والصلاحيات والتواصل بقاعدة البيانات في مرحلة إعداد Backend.</Text><View style={styles.comingTag}><Text style={styles.comingText}>واجهة أولية جاهزة للتوسّع</Text></View></View>
            )}
          </ScrollView>
        </View>
      </View>

      <Modal visible={!!draft} animationType="fade" transparent onRequestClose={() => setDraft(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>{draft && items.some(item => item.id === draft.id) ? "تعديل القسم" : "إضافة قسم جديد"}</Text><Pressable onPress={() => setDraft(null)}><Text style={styles.close}>✕</Text></Pressable></View>
            <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.fieldLabel}>اسم الخدمة بالعربية</Text>
              <TextInput value={draft?.title ?? ""} onChangeText={value => updateDraft("title", value)} placeholder="مثال: كهرباء" style={styles.field} />
              <Text style={styles.fieldLabel}>اسم الخدمة بالإنجليزية</Text>
              <TextInput value={draft?.english ?? ""} onChangeText={value => updateDraft("english", value)} placeholder="Electricity" style={styles.field} />
              <Text style={styles.fieldLabel}>وصف مختصر</Text>
              <TextInput value={draft?.shortDescription ?? ""} onChangeText={value => updateDraft("shortDescription", value)} placeholder="وصف يظهر في بطاقة الخدمة" style={[styles.field, styles.multiline]} multiline />
              <Text style={styles.fieldLabel}>تفاصيل الخدمة</Text>
              <TextInput value={draft?.details ?? ""} onChangeText={value => updateDraft("details", value)} placeholder="اكتب تفاصيل الخدمة..." style={[styles.field, styles.multiline]} multiline />
              <Text style={styles.fieldLabel}>رابط الصورة</Text>
              <TextInput value={draft?.image ?? ""} onChangeText={value => updateDraft("image", value)} placeholder="https://..." autoCapitalize="none" style={[styles.field, { textAlign: "left" }]} />
              <Text style={styles.fieldLabel}>نوع القسم</Text>
              <View style={styles.groupChoices}>
                <Pressable onPress={() => updateDraft("group", "main")} style={[styles.groupChoice, draft?.group === "main" && styles.groupChoiceActive]}><Text style={[styles.groupChoiceText, draft?.group === "main" && styles.groupChoiceTextActive]}>خدمة رئيسية</Text></Pressable>
                <Pressable onPress={() => updateDraft("group", "featured")} style={[styles.groupChoice, draft?.group === "featured" && styles.groupChoiceActive]}><Text style={[styles.groupChoiceText, draft?.group === "featured" && styles.groupChoiceTextActive]}>خدمة مميزة</Text></Pressable>
              </View>
              <Text style={styles.fieldLabel}>حالة الظهور</Text>
              <View style={styles.groupChoices}>
                <Pressable onPress={() => updateDraft("active", true as never)} style={[styles.groupChoice, draft?.active !== false && styles.groupChoiceActive]}><Text style={[styles.groupChoiceText, draft?.active !== false && styles.groupChoiceTextActive]}>ظاهر للعملاء</Text></Pressable>
                <Pressable onPress={() => updateDraft("active", false as never)} style={[styles.groupChoice, draft?.active === false && styles.groupChoiceActive]}><Text style={[styles.groupChoiceText, draft?.active === false && styles.groupChoiceTextActive]}>مخفي</Text></Pressable>
              </View>
              <Text style={styles.modalHint}>حذف رابط الصورة أو تركه فارغًا يزيل الصورة من بطاقة الخدمة.</Text>
            </ScrollView>
            <View style={styles.modalActions}><Pressable onPress={() => setDraft(null)} style={styles.cancelButton}><Text style={styles.cancelText}>إلغاء</Text></Pressable><Pressable onPress={saveDraft} style={styles.saveButton}><Text style={styles.saveText}>حفظ التعديلات</Text></Pressable></View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F3F6F5" },
  layout: { flex: 1, flexDirection: "row" },
  layoutCompact: { flexDirection: "column" },
  sidebar: { width: 245, backgroundColor: "#102A34", paddingHorizontal: 18, paddingVertical: 24, justifyContent: "space-between" },
  sidebarCompact: { width: "100%", paddingVertical: 13, paddingHorizontal: 16 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 38 },
  logo: { width: 42, height: 42, borderRadius: 13, backgroundColor: "#0B9A8B", alignItems: "center", justifyContent: "center" },
  logoText: { color: "#FFFFFF", fontSize: 25, fontWeight: "900" },
  brandName: { color: "#FFFFFF", fontSize: 17, fontWeight: "900" },
  brandSub: { color: "#88A6A8", fontSize: 9, letterSpacing: 1.5, marginTop: 3 },
  menuCaption: { color: "#789398", fontSize: 10, fontWeight: "800", marginBottom: 13, textAlign: "right" },
  menu: { gap: 8, flex: 1 },
  menuCompact: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, marginBottom: 4 },
  menuButton: { minHeight: 47, borderRadius: 11, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 12, position: "relative" },
  menuButtonActive: { backgroundColor: "#1D4149" },
  menuIcon: { color: "#89A4A8", fontSize: 17, width: 20, textAlign: "center" },
  menuText: { color: "#B7C7C9", fontSize: 12, fontWeight: "700" },
  menuTextActive: { color: "#FFFFFF" },
  menuIndicator: { position: "absolute", right: 0, width: 3, height: 23, borderRadius: 4, backgroundColor: "#13B6A2" },
  sidebarBottom: { borderTopWidth: 1, borderTopColor: "#29464D", paddingTop: 18, flexDirection: "row", alignItems: "center", gap: 10 },
  adminAvatar: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#D9EAE4", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#087A70", fontWeight: "900" },
  adminName: { color: "#FFFFFF", fontSize: 11, fontWeight: "800", textAlign: "right" },
  adminRole: { color: "#88A6A8", fontSize: 9, marginTop: 3, textAlign: "right" },
  logout: { color: "#A8C0C3", fontSize: 21, paddingHorizontal: 5 },
  main: { flex: 1, minWidth: 0 },
  topbar: { minHeight: 84, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E7ECEA", paddingHorizontal: 28, paddingVertical: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 15 },
  pageKicker: { color: "#8A9A9D", fontSize: 9, fontWeight: "900", letterSpacing: 1.5, textAlign: "right" },
  pageTitle: { color: "#102A34", fontSize: 22, fontWeight: "900", marginTop: 5, textAlign: "right" },
  topActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  previewBadge: { backgroundColor: "#FFF6E4", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", gap: 7 },
  previewDot: { width: 6, height: 6, borderRadius: 5, backgroundColor: "#D99A31" },
  previewBadgeText: { color: "#956B25", fontSize: 10, fontWeight: "800" },
  siteButton: { backgroundColor: "#102A34", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 13 },
  siteButtonText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  content: { padding: 25, paddingBottom: 50, width: "100%", maxWidth: 1450, alignSelf: "center" },
  welcome: { backgroundColor: "#E1F1EB", borderRadius: 17, padding: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18, overflow: "hidden" },
  welcomeTitle: { color: "#14343B", fontSize: 17, fontWeight: "900", textAlign: "right" },
  welcomeText: { color: "#607C7B", fontSize: 11, marginTop: 6, textAlign: "right" },
  welcomePattern: { color: "#A2D7C9", fontSize: 52, fontWeight: "900" },
  stats: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 29 },
  statCard: { flex: 1, minWidth: 145, backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E6ECE9", padding: 16 },
  statLabel: { color: "#839397", fontSize: 10, fontWeight: "700", textAlign: "right" },
  statValue: { color: "#102A34", fontSize: 26, fontWeight: "900", marginTop: 9, textAlign: "right" },
  statFoot: { color: "#0A9587", fontSize: 9, marginTop: 5, textAlign: "right" },
  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 15, marginBottom: 16 },
  sectionTitle: { color: "#102A34", fontSize: 19, fontWeight: "900", textAlign: "right" },
  sectionSub: { color: "#8A989B", fontSize: 11, marginTop: 6, textAlign: "right" },
  addActions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  addButton: { backgroundColor: "#07877B", borderRadius: 10, paddingVertical: 11, paddingHorizontal: 14 },
  addButtonText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
  addButtonOutline: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CDE4DC", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  addButtonOutlineText: { color: "#07877B", fontSize: 10, fontWeight: "900" },
  search: { height: 45, borderRadius: 10, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5ECE8", paddingHorizontal: 14, marginBottom: 12, color: "#17343D", textAlign: "right", fontSize: 12 },
  filters: { flexDirection: "row", gap: 8, marginBottom: 18, flexWrap: "wrap" },
  filterButton: { borderRadius: 9, paddingVertical: 9, paddingHorizontal: 13, backgroundColor: "#E8EEEB" },
  filterButtonActive: { backgroundColor: "#D9F0E9" },
  filterText: { color: "#758589", fontSize: 10, fontWeight: "800" },
  filterTextActive: { color: "#087D72" },
  serviceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 13 },
  serviceCard: { width: "31.5%", minWidth: 205, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E6ECE9", borderRadius: 14, overflow: "hidden" },
  serviceImage: { width: "100%", height: 105, backgroundColor: "#E1EAE6" },
  serviceCardBody: { padding: 12 },
  serviceCardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5 },
  serviceName: { color: "#16343C", fontSize: 12, fontWeight: "900", flexShrink: 1, textAlign: "right" },
  groupTag: { color: "#07877B", backgroundColor: "#E7F4EF", borderRadius: 6, overflow: "hidden", paddingHorizontal: 7, paddingVertical: 4, fontSize: 8, fontWeight: "800" },
  serviceEnglish: { color: "#9BA8A9", fontSize: 9, marginTop: 5, textAlign: "right" },
  serviceDescription: { color: "#738287", fontSize: 10, lineHeight: 17, marginTop: 8, textAlign: "right" },
  cardActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  editButton: { backgroundColor: "#E4F3ED", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  editText: { color: "#087D72", fontSize: 10, fontWeight: "900" },
  deleteButton: { backgroundColor: "#FFF0EF", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  deleteText: { color: "#C45B54", fontSize: 10, fontWeight: "900" },
  emptyState: { minHeight: 430, backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E6ECE9", alignItems: "center", justifyContent: "center", padding: 28 },
  emptyIcon: { color: "#0A9587", fontSize: 42 },
  emptyTitle: { color: "#102A34", fontSize: 20, fontWeight: "900", marginTop: 16 },
  emptyText: { color: "#819095", fontSize: 12, lineHeight: 22, textAlign: "center", maxWidth: 460, marginTop: 8 },
  comingTag: { backgroundColor: "#E8F4EF", borderRadius: 20, paddingHorizontal: 13, paddingVertical: 8, marginTop: 18 },
  comingText: { color: "#07877B", fontSize: 10, fontWeight: "900" },
  settingsCard: { backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E6ECE9", padding: 26, minHeight: 260 },
  settingsText: { color: "#738287", fontSize: 13, lineHeight: 25, textAlign: "right", marginTop: 12 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(8, 26, 31, 0.62)", justifyContent: "center", alignItems: "center", padding: 16 },
  modalCard: { width: "100%", maxWidth: 650, maxHeight: "92%", backgroundColor: "#FFFFFF", borderRadius: 18, padding: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  modalTitle: { color: "#102A34", fontSize: 18, fontWeight: "900" },
  close: { color: "#748489", fontSize: 20, padding: 5 },
  modalScroll: { maxHeight: 580 },
  fieldLabel: { color: "#3E555B", fontSize: 11, fontWeight: "800", marginTop: 12, marginBottom: 7, textAlign: "right" },
  field: { borderWidth: 1, borderColor: "#E3EBE7", backgroundColor: "#F8FAF9", borderRadius: 9, minHeight: 43, paddingHorizontal: 12, color: "#19383F", fontSize: 12, textAlign: "right" },
  multiline: { minHeight: 76, textAlignVertical: "top", paddingTop: 10 },
  groupChoices: { flexDirection: "row", gap: 9 },
  groupChoice: { borderWidth: 1, borderColor: "#E1E9E5", borderRadius: 9, paddingVertical: 11, paddingHorizontal: 16 },
  groupChoiceActive: { backgroundColor: "#E4F3ED", borderColor: "#A8D6C8" },
  groupChoiceText: { color: "#738287", fontSize: 11, fontWeight: "800" },
  groupChoiceTextActive: { color: "#087D72" },
  modalHint: { color: "#97A4A5", fontSize: 9, marginTop: 12, textAlign: "right" },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 9, marginTop: 18 },
  cancelButton: { borderWidth: 1, borderColor: "#DFE8E4", borderRadius: 9, paddingVertical: 11, paddingHorizontal: 18 },
  cancelText: { color: "#728186", fontSize: 11, fontWeight: "800" },
  saveButton: { backgroundColor: "#07877B", borderRadius: 9, paddingVertical: 11, paddingHorizontal: 20 },
  saveText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" }
});
