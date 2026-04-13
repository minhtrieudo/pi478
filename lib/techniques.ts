export type Phase = {
  type: 'inhale' | 'hold' | 'exhale' | 'hold2';
  seconds: number;
  label: string;
  whisper: string;
};

export type Technique = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  benefit: string;
  tag: string;
  tagColor: string;
  duration: string;
  phases: Phase[];
  cycles: number;
  soundscape: 'rain' | 'ocean' | 'forest' | 'silence';
  forMoods: string[];
};

export const TECHNIQUES: Technique[] = [
  {
    id: 'reset',
    name: 'Thở Reset Nhanh',
    emoji: '⚡',
    tagline: 'Giảm stress tức thì',
    benefit: 'Bài thở sinh lý học (Physiological Sigh) — kỹ thuật duy nhất được não bộ thiết kế sẵn để tắt căng thẳng ngay lập tức.',
    tag: 'Khi stress', tagColor: '#e08030',
    duration: '2 phút',
    phases: [
      { type: 'inhale', seconds: 2, label: 'Hít vào', whisper: 'Hít một hơi dài qua mũi...' },
      { type: 'inhale', seconds: 1, label: 'Hít thêm', whisper: 'Hít thêm một tí nữa...' },
      { type: 'exhale', seconds: 6, label: 'Thở ra thật dài', whisper: 'Thở ra thật chậm... buông hết đi...' },
    ],
    cycles: 5,
    soundscape: 'forest',
    forMoods: ['stressed', 'anxious', 'overwhelmed'],
  },
  {
    id: 'box',
    name: 'Thở Hộp',
    emoji: '📦',
    tagline: 'Tập trung làm việc & học',
    benefit: 'Box Breathing được Navy SEALs dùng để giữ bình tĩnh dưới áp lực. Cân bằng hệ thần kinh, tăng tập trung rõ rệt.',
    tag: 'Làm việc', tagColor: '#3b82c4',
    duration: '4 phút',
    phases: [
      { type: 'inhale', seconds: 4, label: 'Hít vào', whisper: 'Từ từ hít vào...' },
      { type: 'hold',   seconds: 4, label: 'Nín thở', whisper: 'Giữ nhẹ nhàng...' },
      { type: 'exhale', seconds: 4, label: 'Thở ra',  whisper: 'Thả lỏng từng chút...' },
      { type: 'hold2',  seconds: 4, label: 'Nghỉ',    whisper: 'Khoảng lặng bình yên...' },
    ],
    cycles: 5,
    soundscape: 'silence',
    forMoods: ['unfocused', 'normal', 'tired'],
  },
  {
    id: '478',
    name: 'Thở Ngủ Ngon',
    emoji: '🌙',
    tagline: 'Dễ ngủ sâu hơn',
    benefit: '4-7-8 do Dr. Andrew Weil phát triển. Kích hoạt hệ phó giao cảm, hạ nhịp tim, đưa cơ thể vào trạng thái sẵn sàng ngủ.',
    tag: 'Trước ngủ', tagColor: '#7c5cbf',
    duration: '4 phút',
    phases: [
      { type: 'inhale', seconds: 4, label: 'Hít vào', whisper: 'Hít vào nhẹ nhàng qua mũi...' },
      { type: 'hold',   seconds: 7, label: 'Nín thở', whisper: 'Giữ yên... cơ thể đang thư giãn...' },
      { type: 'exhale', seconds: 8, label: 'Thở ra',  whisper: 'Thở ra thật dài qua miệng... buông hết lo lắng...' },
    ],
    cycles: 4,
    soundscape: 'rain',
    forMoods: ['anxious', 'tired', 'stressed'],
  },
  {
    id: 'energy',
    name: 'Thở Năng Lượng',
    emoji: '☀️',
    tagline: 'Tỉnh táo buổi sáng',
    benefit: 'Phiên bản nhẹ của Wim Hof. Tăng oxy, kích hoạt hệ thần kinh giao cảm nhẹ, giúp tỉnh ngủ và sẵn sàng cho ngày mới.',
    tag: 'Buổi sáng', tagColor: '#d4a020',
    duration: '3 phút',
    phases: [
      { type: 'inhale', seconds: 2, label: 'Hít mạnh', whisper: 'Hít thật sâu và mạnh...' },
      { type: 'exhale', seconds: 1, label: 'Thở nhanh', whisper: 'Thở ra nhanh...' },
    ],
    cycles: 20,
    soundscape: 'forest',
    forMoods: ['tired', 'low_energy', 'normal'],
  },
  {
    id: 'coherent',
    name: 'Thở Bình Yên',
    emoji: '🌊',
    tagline: 'Thư giãn sâu nhất',
    benefit: 'Coherent Breathing 5.5 giây — nhịp thở tự nhiên của tim. Đồng bộ hệ thần kinh, giảm huyết áp, cảm giác bình an kéo dài.',
    tag: 'Thư giãn', tagColor: '#2d9e7a',
    duration: '5 phút',
    phases: [
      { type: 'inhale', seconds: 5, label: 'Hít vào', whisper: 'Hít vào đều đặn...' },
      { type: 'exhale', seconds: 6, label: 'Thở ra',  whisper: 'Thở ra nhẹ nhàng...' },
    ],
    cycles: 6,
    soundscape: 'ocean',
    forMoods: ['anxious', 'stressed', 'normal', 'happy'],
  },
  {
    id: 'recovery',
    name: 'Thở Phục Hồi',
    emoji: '🌱',
    tagline: 'Sau mệt mỏi, làm việc nhiều',
    benefit: 'Kết hợp thở sâu và nghỉ ngơi có ý thức. Giúp cơ thể và não bộ nạp lại năng lượng sau nhiều giờ làm việc.',
    tag: 'Phục hồi', tagColor: '#3bb88f',
    duration: '6 phút',
    phases: [
      { type: 'inhale', seconds: 4, label: 'Hít vào sâu', whisper: 'Hít vào từ bụng dưới...' },
      { type: 'hold',   seconds: 2, label: 'Giữ nhẹ', whisper: 'Giữ nhẹ thôi...' },
      { type: 'exhale', seconds: 6, label: 'Thở ra chậm', whisper: 'Buông... vai thả lỏng...' },
      { type: 'hold2',  seconds: 2, label: 'Nghỉ', whisper: 'Khoảng lặng...' },
    ],
    cycles: 6,
    soundscape: 'forest',
    forMoods: ['tired', 'overwhelmed', 'low_energy'],
  },
  {
    id: 'gentle',
    name: 'Thở Nhẹ Nhàng',
    emoji: '🌸',
    tagline: 'Dành cho bà bầu & người lớn tuổi',
    benefit: 'Nhịp thở chậm, không có pha nín thở. An toàn và dễ chịu cho tất cả mọi người. Giảm lo âu, hỗ trợ tuần hoàn.',
    tag: 'Mọi người', tagColor: '#e08080',
    duration: '5 phút',
    phases: [
      { type: 'inhale', seconds: 4, label: 'Hít vào nhẹ', whisper: 'Hít vào thật thoải mái...' },
      { type: 'exhale', seconds: 6, label: 'Thở ra nhẹ', whisper: 'Thở ra nhẹ nhàng...' },
    ],
    cycles: 8,
    soundscape: 'rain',
    forMoods: ['anxious', 'tired', 'normal'],
  },
  {
    id: 'triangle',
    name: 'Thở Tam Giác',
    emoji: '🔺',
    tagline: 'Cân bằng cơ thể & tâm trí',
    benefit: 'Ba pha đều nhau tạo nhịp đập tim ổn định. Dễ học, dễ nhớ — bài thở tốt để bắt đầu cho người mới.',
    tag: 'Cân bằng', tagColor: '#6b8cc4',
    duration: '4 phút',
    phases: [
      { type: 'inhale', seconds: 4, label: 'Hít vào', whisper: 'Hít vào...' },
      { type: 'hold',   seconds: 4, label: 'Nín thở', whisper: 'Giữ yên...' },
      { type: 'exhale', seconds: 4, label: 'Thở ra',  whisper: 'Thở ra...' },
    ],
    cycles: 6,
    soundscape: 'forest',
    forMoods: ['normal', 'unfocused', 'tired'],
  },
];

export const MOOD_OPTIONS = [
  { id: 'tired',       emoji: '😴', label: 'Mệt mỏi',       color: '#9b8ec4' },
  { id: 'anxious',     emoji: '😰', label: 'Lo lắng',        color: '#c48e3b' },
  { id: 'normal',      emoji: '😐', label: 'Bình thường',    color: '#7aaa94' },
  { id: 'happy',       emoji: '😊', label: 'Vui vẻ',         color: '#3bb88f' },
  { id: 'low_energy',  emoji: '⚡', label: 'Thiếu năng lượng', color: '#c4a43b' },
  { id: 'stressed',    emoji: '😤', label: 'Căng thẳng',     color: '#c46a3b' },
  { id: 'overwhelmed', emoji: '😵', label: 'Quá tải',        color: '#c43b3b' },
  { id: 'unfocused',   emoji: '🌀', label: 'Mất tập trung',  color: '#3b7cc4' },
];

export function suggestTechnique(moodId: string): Technique {
  const matches = TECHNIQUES.filter(t => t.forMoods.includes(moodId));
  if (matches.length === 0) return TECHNIQUES[4]; // coherent as default
  return matches[Math.floor(Math.random() * matches.length)];
}

export const MOOD_SUGGESTIONS: Record<string, string> = {
  tired:       'Thấy mệt à? Mình thử Thở Phục Hồi nhé — nhẹ thôi, 6 phút là lại sức liền.',
  anxious:     'Lo lắng thì mình thử Thở Ngủ Ngon — bài này tắt lo âu nhanh lắm.',
  normal:      'Ngày bình thường thì mình thử Thở Bình Yên — đẹp lắm, như sóng biển ấy.',
  happy:       'Vui thì còn muốn thở à? Thì cũng được — Thở Bình Yên sẽ giữ năng lượng tốt này lâu hơn.',
  low_energy:  'Thiếu năng lượng thì Thở Năng Lượng đúng rồi — 3 phút là tỉnh ngay.',
  stressed:    'Căng thẳng? Thở Reset Nhanh là bài mình thiết kế riêng cho lúc này. Thử đi!',
  overwhelmed: 'Quá tải rồi — dừng lại. Thở Reset Nhanh 2 phút thôi, mình dẫn bạn.',
  unfocused:   'Mất tập trung thì Thở Hộp là chuẩn nhất. Navy SEALs dùng đó!',
};
