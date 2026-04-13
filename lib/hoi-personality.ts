// ─── Nhân vật HƠI — người bạn của app ────────────────────────────────────────
// Hơi là một người bạn nhỏ hay quan tâm, không phải trợ lý.
// Hơi nói chuyện thật, đôi khi hài hước nhẹ, luôn chân thành.

export function getHoiMessage(context: {
  username: string;
  streak: number;
  totalSessions: number;
  totalMinutes: number;
  lastSessionDate: string;
  hour: number;
  moodBefore?: number;
  moodAfter?: number;
  isFirstTime?: boolean;
  sessionJustDone?: boolean;
  isWilting?: boolean;
}) {
  const {
    username, streak, totalSessions, totalMinutes,
    lastSessionDate, hour, moodBefore, moodAfter,
    isFirstTime, sessionJustDone, isWilting,
  } = context;

  const name = username.split('_')[0]; // bỏ phần số nếu có
  const today = new Date().toISOString().split('T')[0];
  const trainedToday = lastSessionDate === today;
  const daysSinceLast = lastSessionDate
    ? Math.floor((Date.now() - new Date(lastSessionDate).getTime()) / 86400000)
    : 999;

  // === Lần đầu dùng app ===
  if (isFirstTime || totalSessions === 0) {
    return {
      greeting: `Ơ, ${name} mới đến à?`,
      message: 'Mình là Hơi — người bạn hít thở của bạn. Mình sẽ ở đây mỗi ngày, không đi đâu hết. Hôm nay thử 3 phút thôi nhé?',
      cta: 'Thử lần đầu tiên 🌱',
      mood: '🌱',
    };
  }

  // === Vừa xong buổi tập ===
  if (sessionJustDone && moodBefore && moodAfter) {
    const improved = moodAfter > moodBefore;
    const same = moodAfter === moodBefore;
    if (improved) return {
      greeting: `${name} thấy khác rồi chứ?`,
      message: `Tâm trạng tăng từ ${moodBefore}⭐ lên ${moodAfter}⭐. Mình biết mà — hít thở đúng cách thật sự có tác dụng. Hẹn ngày mai nhé!`,
      cta: null, mood: '✨',
    };
    if (same) return {
      greeting: 'Cũng được rồi!',
      message: `Hôm nay tâm trạng không thay đổi nhiều, nhưng bạn đã tập — đó là điều quan trọng nhất. Ngày mai thử kỹ thuật khác xem sao?`,
      cta: null, mood: '🤝',
    };
    return {
      greeting: 'Không sao hết.',
      message: `Đôi khi tập xong vẫn chưa thấy khác ngay. Nhưng bên trong, cơ thể bạn đang biết ơn lắm đó. Mình ở đây nếu bạn muốn nói chuyện.`,
      cta: null, mood: '💙',
    };
  }

  // === Cây sắp héo ===
  if (isWilting) {
    return {
      greeting: `${name} ơi...`,
      message: `${daysSinceLast} ngày rồi mình chưa thấy bạn. Cây của mình đang nhớ bạn lắm. Chỉ 3 phút thôi — vì chính bạn, không phải vì streak.`,
      cta: `Quay lại thôi ${name} 🌿`,
      mood: '🍂',
    };
  }

  // === Đã tập hôm nay rồi ===
  if (trainedToday) {
    if (streak >= 30) return {
      greeting: `${streak} ngày rồi! Wow.`,
      message: `Mình không biết nói gì ngoài việc — bạn thật sự kiên trì. Không phải ai cũng làm được điều này. Mình tự hào về bạn lắm.`,
      cta: 'Tập thêm buổi nữa',
      mood: '🏆',
    };
    if (streak >= 7) return {
      greeting: `Streak ${streak} ngày — đỉnh!`,
      message: `Bạn đang trong nhịp rồi đó. Tuần này tập đều lắm. Cây đang lớn nhanh hơn bạn nghĩ đấy.`,
      cta: 'Một buổi nữa nhé?',
      mood: '🌟',
    };
    return {
      greeting: `Hôm nay tập rồi!`,
      message: `Mình thấy bạn đã tập hôm nay. Cảm giác thế nào? Dù bạn không trả lời thì mình vẫn ở đây nhé.`,
      cta: 'Tập thêm nếu muốn',
      mood: '😊',
    };
  }

  // === Theo giờ trong ngày ===
  if (hour >= 5 && hour < 9) return {
    greeting: `Dậy sớm vậy ${name}?`,
    message: `Buổi sáng là lúc não bộ dễ tiếp nhận nhất. 5 phút Coherent 5-5 ngay bây giờ — cả ngày sẽ khác.`,
    cta: 'Bắt đầu buổi sáng 🌅',
    mood: '🌅',
  };

  if (hour >= 9 && hour < 12) return {
    streak >= 3 ? {
      greeting: `${streak} ngày rồi ${name}!`,
      message: `Buổi sáng này chưa tập nhỉ? Đừng để streak của mình bị gián đoạn. Mình biết bạn bận, nên 3 phút Box Breathing thôi.`,
      cta: 'Tập nhanh trước trưa',
      mood: '⏰',
    } : {
      greeting: `Buổi sáng tốt lành ${name}!`,
      message: `Hôm nay chưa tập nhỉ? Không cần lâu — 3 phút Box Breathing là đủ để não bộ tỉnh táo hơn hẳn.`,
      cta: 'Tập 3 phút thôi 💨',
      mood: '☀️',
    }
  }[0];

  if (hour >= 12 && hour < 14) return {
    greeting: `Giờ nghỉ trưa nè ${name}`,
    message: `Thay vì lướt điện thoại, thử 4 phút Tam giác xem? Buổi chiều sẽ tập trung hơn nhiều — mình hứa.`,
    cta: 'Nghỉ trưa đúng cách 🍃',
    mood: '🌿',
  };

  if (hour >= 14 && hour < 18) return {
    greeting: `${name} đang làm việc à?`,
    message: `${totalMinutes > 60 ? `${totalMinutes} phút tập rồi đó — ` : ''}Buổi chiều hay buồn ngủ lắm. Box Breathing 4-4-4-4 giúp tỉnh táo ngay mà không cần cà phê.`,
    cta: 'Chống buồn ngủ 💼',
    mood: '💡',
  };

  if (hour >= 18 && hour < 21) return {
    greeting: `Tối rồi ${name} ơi`,
    message: streak > 0
      ? `Streak ${streak} ngày của bạn đang chờ được hoàn thành hôm nay. Buổi tối là lúc tuyệt vời để thư giãn.`
      : `Một ngày dài hả? Mình biết cảm giác đó. Thử 4-7-8 đi — không cần nghĩ gì cả, chỉ cần thở.`,
    cta: 'Thư giãn buổi tối 🌙',
    mood: '🌙',
  };

  // Khuya
  return {
    greeting: `Thức khuya vậy ${name}?`,
    message: `Khuya rồi mà chưa ngủ được à? Bài 4-7-8 sẽ giúp bạn. Mình sẽ ở đây dẫn nhịp thở cho bạn.`,
    cta: 'Ngủ ngon với 4-7-8 💤',
    mood: '💤',
  };
}

// Lời nhắn sau khi xong mỗi pha trong buổi tập
export const PHASE_WHISPERS = {
  inhale: [
    'Từ từ thôi...',
    'Đưa không khí vào sâu hơn nữa',
    'Hít vào đầy phổi đi',
    'Cảm nhận ngực đang nở ra',
  ],
  hold: [
    'Giữ yên...',
    'Để oxy lan toả khắp người',
    'Tĩnh tâm một chút',
    'Thời gian là của bạn',
  ],
  exhale: [
    'Buông hết đi...',
    'Thả lỏng vai ra',
    'Căng thẳng đi theo hơi thở',
    'Nhẹ hơn chưa?',
  ],
  hold2: [
    'Trống rỗng và nhẹ nhàng...',
    'Khoảng lặng này là của bạn',
    'Chuẩn bị hít vào lại',
  ],
};

// Câu khen ngợi sau khi xong buổi
export const SESSION_COMPLIMENTS = [
  'Bạn vừa làm điều tuyệt vời cho bản thân.',
  'Không phải ai cũng dừng lại và hít thở. Bạn thì có.',
  'Cơ thể bạn vừa nhận được món quà từ chính bạn.',
  'Buổi tập này sẽ còn vang vọng trong người bạn cả ngày.',
  'Mình thấy bạn đang tiến bộ từng ngày một.',
  'Không cần phải hoàn hảo — chỉ cần có mặt. Và bạn đã có mặt.',
];

// Động lực khi bỏ lâu ngày
export function getComebackMessage(daysMissed: number, username: string): string {
  const name = username.split('_')[0];
  if (daysMissed <= 3) return `${name} ơi, mình nhớ bạn. Quay lại không?`;
  if (daysMissed <= 7) return `${daysMissed} ngày rồi... Cây đang chờ bạn về nhà.`;
  if (daysMissed <= 14) return `Mình không đi đâu hết. Khi nào bạn sẵn sàng, mình ở đây.`;
  return `Không có điểm bắt đầu nào tốt hơn ngay bây giờ, ${name}.`;
}
