import { type WeatherData } from './weatherService';

export interface Insight {
  icon: string;
  text: string;
  category: 'clothing' | 'activity' | 'warning' | 'tip';
  priority: number; // lower = higher priority
}

/**
 * Smart Insights Engine
 * Generates personalized clothing and activity recommendations
 * based on current weather conditions.
 */
export const generateInsights = (data: WeatherData): Insight[] => {
  const insights: Insight[] = [];
  const temp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const wind = data.wind.speed;
  const humidity = data.main.humidity;
  const uvIndex = data.main.uv_index || 0;
  const weatherMain = data.weather[0]?.main || '';
  const description = data.weather[0]?.description || '';

  // ═══════════════════════════════════════
  //  TEMPERATURE-BASED CLOTHING INSIGHTS
  // ═══════════════════════════════════════

  if (temp <= 0) {
    insights.push({
      icon: '🧥',
      text: 'Dondurucu soğuk! Kalın mont, bere ve eldiven şart. Katmanlı giyinin.',
      category: 'clothing',
      priority: 1,
    });
  } else if (temp <= 5) {
    insights.push({
      icon: '🧣',
      text: 'Hava çok soğuk. Kalın kaban, atkı ve bere almayı unutmayın.',
      category: 'clothing',
      priority: 1,
    });
  } else if (temp <= 12) {
    insights.push({
      icon: '🧶',
      text: 'Serin hava. Kazak veya hafif mont idealdir. Katmanlı giyinmeyi düşünün.',
      category: 'clothing',
      priority: 2,
    });
  } else if (temp <= 18) {
    insights.push({
      icon: '👔',
      text: 'Ilık hava. İnce bir ceket veya hırka yeterli olacaktır.',
      category: 'clothing',
      priority: 3,
    });
  } else if (temp <= 25) {
    insights.push({
      icon: '👕',
      text: 'Harika hava! Tişört ve hafif kıyafetler ile rahat olacaksınız.',
      category: 'clothing',
      priority: 3,
    });
  } else if (temp <= 32) {
    insights.push({
      icon: '🩳',
      text: 'Sıcak bir gün. Açık renkli, nefes alan kumaşlar tercih edin.',
      category: 'clothing',
      priority: 2,
    });
  } else {
    insights.push({
      icon: '🥵',
      text: 'Aşırı sıcak! Açık renkli, bol kıyafetler giyin. Bol su için.',
      category: 'warning',
      priority: 1,
    });
  }

  // ═══════════════════════════════════════
  //  WIND-BASED INSIGHTS
  // ═══════════════════════════════════════

  if (wind > 15) {
    insights.push({
      icon: '💨',
      text: 'Fırtınamsı rüzgar! Dışarıda dikkatli olun, hafif eşyalarınızı koruyun.',
      category: 'warning',
      priority: 1,
    });
  } else if (wind > 10) {
    insights.push({
      icon: '🌬️',
      text: 'Rüzgar sert esiyor. Kalın bir atkı almayı unutmayın, rüzgarlık tercih edin.',
      category: 'clothing',
      priority: 2,
    });
  } else if (wind > 5) {
    insights.push({
      icon: '🍃',
      text: 'Hafif rüzgar var. Saçlarınızı toplamak isteyebilirsiniz.',
      category: 'tip',
      priority: 4,
    });
  }

  // ═══════════════════════════════════════
  //  RAIN / SNOW INSIGHTS
  // ═══════════════════════════════════════

  if (weatherMain === 'Rain' || weatherMain === 'Drizzle') {
    insights.push({
      icon: '☂️',
      text: 'Yağmur bekleniyor! Şemsiye ve su geçirmez ayakkabı almayı unutmayın.',
      category: 'clothing',
      priority: 1,
    });
    insights.push({
      icon: '🏠',
      text: 'Kapalı mekan aktiviteleri için ideal. Müze, kafe veya sinema düşünün.',
      category: 'activity',
      priority: 3,
    });
  }

  if (weatherMain === 'Thunderstorm') {
    insights.push({
      icon: '⚡',
      text: 'Fırtına uyarısı! Mümkünse dışarı çıkmayın, açık alanlardan uzak durun.',
      category: 'warning',
      priority: 0,
    });
  }

  if (weatherMain === 'Snow') {
    insights.push({
      icon: '❄️',
      text: 'Kar yağışı var! Su geçirmez bot ve kalın çorap giyin. Yollar kaygan olabilir.',
      category: 'clothing',
      priority: 1,
    });
    insights.push({
      icon: '⛷️',
      text: 'Kar sporları için harika bir gün! Kayak veya kızak düşünebilirsiniz.',
      category: 'activity',
      priority: 3,
    });
  }

  // ═══════════════════════════════════════
  //  UV INDEX INSIGHTS
  // ═══════════════════════════════════════

  if (uvIndex >= 8) {
    insights.push({
      icon: '🧴',
      text: 'UV indeksi çok yüksek! SPF 50+ güneş kremi, şapka ve güneş gözlüğü şart.',
      category: 'warning',
      priority: 1,
    });
  } else if (uvIndex >= 5) {
    insights.push({
      icon: '🕶️',
      text: 'UV orta-yüksek seviyede. Güneş gözlüğü takın ve güneş kremi sürün.',
      category: 'clothing',
      priority: 2,
    });
  } else if (uvIndex <= 2 && weatherMain === 'Clear' && temp >= 15 && temp <= 28) {
    insights.push({
      icon: '🚶',
      text: 'Hava tam yürüyüşlük! UV indeksi düşük, güneşin keyfini çıkarın.',
      category: 'activity',
      priority: 2,
    });
  }

  // ═══════════════════════════════════════
  //  HUMIDITY INSIGHTS
  // ═══════════════════════════════════════

  if (humidity > 80) {
    insights.push({
      icon: '💧',
      text: 'Nem çok yüksek. Hava boğucu hissedebilir, bol su için.',
      category: 'tip',
      priority: 3,
    });
  } else if (humidity < 25) {
    insights.push({
      icon: '🏜️',
      text: 'Hava çok kuru. Nemlendirici kullanın ve bol su tüketin.',
      category: 'tip',
      priority: 3,
    });
  }

  // ═══════════════════════════════════════
  //  ACTIVITY SUGGESTIONS
  // ═══════════════════════════════════════

  if (weatherMain === 'Clear' && temp >= 20 && temp <= 30 && wind < 8) {
    insights.push({
      icon: '🏃',
      text: 'Açık hava sporu için mükemmel koşullar! Koşu veya bisiklet sürün.',
      category: 'activity',
      priority: 3,
    });
  }

  if (weatherMain === 'Clouds' && temp >= 14 && temp <= 24) {
    insights.push({
      icon: '📸',
      text: 'Bulutlu hava fotoğrafçılık için ideal. Doğal ışık yumuşak olacak.',
      category: 'activity',
      priority: 4,
    });
  }

  if (weatherMain === 'Mist' || weatherMain === 'Fog') {
    insights.push({
      icon: '🌫️',
      text: 'Sisli hava! Araç kullanırken dikkatli olun, görüş mesafesi düşük.',
      category: 'warning',
      priority: 2,
    });
  }

  // Feels-like difference
  const diffFeelsLike = Math.abs(temp - feelsLike);
  if (diffFeelsLike > 5) {
    const warmerOrColder = feelsLike < temp ? 'daha soğuk' : 'daha sıcak';
    insights.push({
      icon: '🌡️',
      text: `Hissedilen sıcaklık ${Math.round(feelsLike)}° — gerçek sıcaklıktan ${Math.round(diffFeelsLike)}° ${warmerOrColder}. Buna göre giyinin.`,
      category: 'tip',
      priority: 2,
    });
  }

  // Sort by priority (lower number = higher priority)
  insights.sort((a, b) => a.priority - b.priority);

  // Return top 3 most relevant insights
  return insights.slice(0, 3);
};
