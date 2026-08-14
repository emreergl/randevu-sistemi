"""
TÜİK Dış Ticaret İstatistikleri - Otomatik Rapor Oluşturma
Akış: Taşıma Şekline Göre kategorisi > 2026+2025 yılları > Tümü > İhracat+İthalat > TL > Raporu Oluştur

Not: Bu site React tabanlı bir SPA. Checkbox id'leri her sayfa yüklemesinde
rastgele bir GUID ile üretiliyor (örn: "03052108-...-tumu"), bu yüzden id
yerine görünen METİN üzerinden (XPath) eşleştirme yapılıyor.
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

URL = "https://bi.tuik.gov.tr/extensions/tuik-mashup/index.html"

# Her tıklamadan önce ne kadar bekleneceği (scroll'un gözle görülmesi için)
SCROLL_BEKLEME = 0.4

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 15)


def scroll_ve_tikla(el):
    """Elementi ekranın ortasına kaydırır, kısa bekler, sonra tıklar."""
    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center', behavior: 'smooth'});", el
    )
    time.sleep(SCROLL_BEKLEME)
    try:
        el.click()
    except Exception:
        # Bazı elementler overlay/animasyon yüzünden normal click almayabilir
        driver.execute_script("arguments[0].click();", el)


driver.get(URL)

# ---------------------------------------------------------------
# ADIM 1: Kategori seçimi -> "Taşıma Şekline Göre"
# ---------------------------------------------------------------
kategori_btn = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//button[contains(@class,'category-button')][contains(.,'Taşıma Şekline Göre')]")
))
scroll_ve_tikla(kategori_btn)

# Bazı akışlarda otomatik ilerliyor, bazılarında "Sonraki Adım" butonuna basmak gerekiyor.
try:
    sonraki = WebDriverWait(driver, 3).until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(.,'Sonraki Adım')]")
    ))
    scroll_ve_tikla(sonraki)
except Exception:
    pass

# ---------------------------------------------------------------
# ADIM 3 (Tarih Seçimi ve Rapor Detayı) bölümünün yüklenmesini bekle
# ---------------------------------------------------------------
wait.until(EC.presence_of_element_located(
    (By.XPATH, "//*[contains(text(),'Tarih Seçimi')]")
))

# ---------------------------------------------------------------
# Yıl dropdown'ını aç (react-select benzeri özel bileşen)
# ---------------------------------------------------------------
yil_dropdown = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//label[normalize-space(text())='Yıl']/following::div[contains(@class,'control')][1]")
))
scroll_ve_tikla(yil_dropdown)

# 2026 seçimi
secenek_2026 = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//div[contains(@class,'custom-option')][.//span[normalize-space(text())='2026']]")
))
scroll_ve_tikla(secenek_2026)

# 2025 seçimi (dropdown genelde açık kalır, tekrar seçilebilir)
secenek_2025 = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//div[contains(@class,'custom-option')][.//span[normalize-space(text())='2025']]")
))
scroll_ve_tikla(secenek_2025)

# Dropdown'ı kapatmak için başlığa tıkla
baslik = driver.find_element(By.XPATH, "//*[contains(text(),'Tarih Seçimi')]")
scroll_ve_tikla(baslik)

# ---------------------------------------------------------------
# Yardımcı fonksiyon: görünen metne göre checkbox/label'a tıkla
# (checkbox'lar readonly, bu yüzden label'a tıklamak gerekiyor)
# ---------------------------------------------------------------
def label_ile_tikla(tam_metin):
    xpath = f"//label[.//span[normalize-space(text())='{tam_metin}']]"
    el = wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
    scroll_ve_tikla(el)

# ---------------------------------------------------------------
# "Tümü" -> Taşıma Şekli Seçimi listesindeki tüm kodları işaretler
# ---------------------------------------------------------------
label_ile_tikla("Tümü")

# ---------------------------------------------------------------
# İhracat / İthalat Seçimi
# ---------------------------------------------------------------
label_ile_tikla("İhracat")
label_ile_tikla("İthalat")

# ---------------------------------------------------------------
# Para Birimi -> TL
# ---------------------------------------------------------------
label_ile_tikla("TL")

# ---------------------------------------------------------------
# Raporu Oluştur
# ---------------------------------------------------------------
raporu_olustur_btn = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//button[contains(@class,'submit-button')][contains(.,'Raporu Oluştur')]")
))
scroll_ve_tikla(raporu_olustur_btn)

# Rapor genelde yeni bir sekme/pencerede ya da aynı sayfada #/report olarak açılır.
time.sleep(2)
if len(driver.window_handles) > 1:
    driver.switch_to.window(driver.window_handles[-1])

print("Rapor oluşturuldu. Güncel URL:", driver.current_url)

# driver.quit()  # işiniz bittiğinde açın