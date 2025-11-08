export type ToastVariant = 'default' | 'destructive' | 'success';

export class AppError extends Error {
  code: string;
  status?: number;
  userMessage?: string;
  meta?: any;
  constructor(code: string, status?: number, userMessage?: string, meta?: any) {
    super(userMessage || code);
    this.code = code;
    this.status = status;
    this.userMessage = userMessage;
    this.meta = meta;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

function msgOf(err: any): string {
  try { return String(err?.message || '').toLowerCase(); } catch { return ''; }
}

function codeOf(err: any): string {
  try {
    const c = err?.code || err?.status || err?.error?.code || err?.error?.status;
    return c ? String(c).toLowerCase() : '';
  } catch { return ''; }
}

export function classifyError(err: any): AppError {
  if (err instanceof AppError) return err;
  const m = msgOf(err);
  const c = codeOf(err);

  if (m.includes('no gemini api keys available') || m.includes('no active gemini api key available')) {
    return new AppError('NO_KEYS', 400, 'প্রোফাইলে অন্তত ১টি Gemini API key যুক্ত করুন।');
  }

  if (
    m.includes('429') || m.includes('rate limit') || m.includes('quota') ||
    m.includes('resource_exhausted') || m.includes('overloaded')
  ) {
    return new AppError('RATE_LIMIT', 429, 'সার্ভিসে অস্থায়ী চাপ রয়েছে। একটু পর আবার চেষ্টা করুন।');
  }

  if (m.includes('api key not valid') || m.includes('invalid api key')) {
    return new AppError('INVALID_KEY', 401, 'API key সঠিক নয়। প্রোফাইলে কী ঠিক করে দিন।');
  }

  if (m.includes('permission_denied') || m.includes('forbidden') || c.includes('403') || m.includes('leaked')) {
    return new AppError('PERMISSION', 403, 'API key-এর অনুমতি নেই বা কীটি লিকড/অকার্যকর। নতুন কী দিন।');
  }

  if (m.includes('internal server error') || c.includes('500')) {
    return new AppError('INTERNAL', 500, 'AI সার্ভিসে অভ্যন্তরীণ ত্রুটি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
  }

  if (m.includes('failed to fetch') || m.includes('network') || m.includes('timeout')) {
    return new AppError('NETWORK', 503, 'নেটওয়ার্ক সমস্যা হয়েছে। ইন্টারনেট চেক করে আবার চেষ্টা করুন।');
  }

  if (m.includes('all api keys exhausted') || m.includes('all gemini keys exhausted')) {
    return new AppError('AI_EXHAUSTED', 503, 'সব API key আপাতত ব্যবহারের বাইরে। একটু পর আবার চেষ্টা করুন।');
  }

  return new AppError('UNKNOWN', 500, 'একটি অজানা ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
}

export function toUserToast(err: AppError): { title: string; description: string; variant: ToastVariant } {
  switch (err.code) {
    case 'NO_KEYS':
      return { title: 'API Key প্রয়োজন', description: 'Profile > API Keys-এ গিয়ে একটি বৈধ Gemini key যোগ করুন।', variant: 'destructive' };
    case 'RATE_LIMIT':
      return { title: 'রেট লিমিট', description: 'কিছু সময় পর আবার চেষ্টা করুন বা Regenerate ক্লিক করুন।', variant: 'default' };
    case 'INVALID_KEY':
      return { title: 'Invalid API Key', description: 'প্রোফাইলে দেয়া key ঠিক নেই। নতুন key দিয়ে আবার চেষ্টা করুন।', variant: 'destructive' };
    case 'PERMISSION':
      return { title: 'Permission সমস্যা', description: 'Key-এর পারমিশন নেই বা কীটি লিকড। নতুন key ব্যবহার করুন।', variant: 'destructive' };
    case 'INTERNAL':
      return { title: 'AI Internal Error', description: 'সার্ভিসে ত্রুটি। Regenerate করলে ঠিক হতে পারে।', variant: 'destructive' };
    case 'NETWORK':
      return { title: 'নেটওয়ার্ক সমস্যা', description: 'ইন্টারনেট কানেকশন ঠিক আছে কিনা দেখুন, তারপর আবার চেষ্টা করুন।', variant: 'default' };
    case 'AI_EXHAUSTED':
      return { title: 'সব কী ব্যস্ত', description: 'সকল কী অস্থায়ীভাবে ব্যস্ত। কিছুক্ষণ পরে চেষ্টা করুন।', variant: 'default' };
    default:
      return { title: 'ত্রুটি', description: 'একটি ত্রুটি ঘটেছে। পরে চেষ্টা করুন।', variant: 'destructive' };
  }
}

export function toDisplayMessage(err: AppError): string {
  switch (err.code) {
    case 'NO_KEYS':
      return '⚠️ API key কনফিগার করা নেই। Profile > API Keys থেকে একটি বৈধ key যোগ করুন, তারপর আবার চেষ্টা করুন।';
    case 'RATE_LIMIT':
      return '⏳ সার্ভিসে অস্থায়ী চাপ রয়েছে। কিছুক্ষন পর Regenerate করুন।';
    case 'INVALID_KEY':
      return '❌ ব্যবহৃত API key টি সঠিক নয়। নতুন key দিয়ে আবার চেষ্টা করুন।';
    case 'PERMISSION':
      return '🔒 আপনার API key দিয়ে এই অপারেশন করা যায়নি (permission/leak)। নতুন key ব্যবহার করুন।';
    case 'INTERNAL':
      return '💥 AI সার্ভিসে অভ্যন্তরীণ ত্রুটি ঘটেছে। দয়া করে Regenerate করুন।';
    case 'NETWORK':
      return '🌐 নেটওয়ার্ক সমস্যার জন্য রিকোয়েস্ট সম্পন্ন হয়নি। পরে চেষ্টা করুন।';
    case 'AI_EXHAUSTED':
      return '🔁 সব API key আপাতত ব্যবহারের বাইরে। কিছুক্ষণ পরে আবার চেষ্টা করুন।';
    default:
      return '❗ একটি অজানা ত্রুটি ঘটেছে। পরে আবার চেষ্টা করুন।';
  }
}
