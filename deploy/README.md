# تحویل سایت ارتباط فردا به DevOps

سایت عمومی فارسی و انگلیسی، پنل مدیریت، پردازش تصاویر و ارسال ایمیل در یک سرویس Next.js اجرا می‌شوند. Compose این سرویس و Nginx را بالا می‌آورد. برنامه روی شبکهٔ داخلی Docker پورت ۳۰۰۰ دارد. Nginx روی میزبان به‌صورت پیش‌فرض فقط از `127.0.0.1:8080` در دسترس است.

## راه‌اندازی

۱. برنچ `feature/posts-admin` را روی میزبان Docker دریافت کنید. مقادیر [نمونهٔ تنظیمات](production.env.example) را در فایلی بیرون از مخزن قرار دهید و دسترسی فایل را محدود کنید. `EFARDA_SITE_URL` باید آدرس نهایی HTTPS باشد. SMTP و آدرس دریافت اعلان ورود را هم در همین فایل تنظیم کنید.

۲. یک volume **محلی و دائمی** ایجاد کنید. اگر `EFARDA_DB_VOLUME` را تغییر دادید، همان نام را در دستور به‌کار ببرید.

```sh
docker volume create efarda-posts
```

۳. برای پایگاه دادهٔ خالی، یک رمز موقت تصادفی و قوی در فایلی خارج از checkout بسازید. فایل باید فقط در اختیار تیم باشد و در زمان mount برای کاربر کانتینر `node` با UID 1000 قابل خواندن باشد. در لینوکس می‌توان فایل را با مالک 1000 و مجوز 0400 در یک پوشهٔ محدود نگه داشت. مسیر فایل و نام کاربری اولیه را برای اولین اجرا بدهید.

```sh
EFARDA_ADMIN_USERNAME=initial-admin \
EFARDA_ADMIN_SECRET_FILE=/secure/efarda/bootstrap-password \
docker compose --env-file /secure/efarda/production.env \
  -f compose.yaml -f compose.bootstrap.yaml up -d --build --wait
```

۴. پس از ساخت حساب اولیه، اجرای عادی را بدون فایل bootstrap بالا بیاورید و رمز موقت را از محیط استقرار حذف کنید. در اولین ورود از `/admin/login`، مدیر رمز را عوض می‌کند و ایمیل بازیابی را تأیید می‌کند. برای پایگاه داده‌ای که از قبل کاربر دارد، مستقیم از اجرای عادی استفاده کنید.

```sh
docker compose --env-file /secure/efarda/production.env up -d --build --wait
docker compose --env-file /secure/efarda/production.env ps
curl -fsS -o /dev/null http://127.0.0.1:8080/
curl -fsS -o /dev/null http://127.0.0.1:8080/en/
```

## دامنه و HTTPS

مالک دامنه نام نهایی را به DevOps اعلام می‌کند. تیم دامنه یا DevOps رکورد DNS را به IP یا نام ورودی اعلام‌شده وصل می‌کند. تیم DevOps گواهی TLS را روی ورودی عمومی تنظیم می‌کند و ترافیک را به Nginx این پروژه می‌فرستد. ساخت image قبل از اتصال DNS ممکن است. برای تست ورود و پیوندهای بازیابی در تولید، دامنه و HTTPS باید فعال باشند.

اگر ورودی عمومی Nginx روی **همان میزبان** اجرا می‌شود، نمونهٔ زیر را در بلوک HTTPS دامنه قرار دهید. در معماری ingress یا load balancer، همان رفتار را با مسیر خصوصی معادل تنظیم کنید. نام میزبان عمومی را حفظ کنید و لاگ ورودی را طوری تنظیم کنید که query پیوندهای بازیابی ثبت نشود.

```nginx
client_max_body_size 25m;

location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_buffering off;
}
```

## SQLite و پشتیبان‌گیری

برای این سایت با یک نمونهٔ فعال و تعداد معمول نویسندگان، SQLite کافی است. سرویس دیتابیس، پورت یا نام کاربری جدا لازم ندارد. برنامه فایل `/var/lib/efarda/site.sqlite` و فایل‌های جانبی WAL را در volume محلی می‌سازد. خبرها، کاربران و تصاویر بارگذاری‌شده داخل همان دیتابیس هستند. اگر قرار است دیتابیس محیط دیگری منتقل شود، از آن نسخهٔ پشتیبان سازگار تهیه کنید و پیش از آغاز سرویس روی volume مقصد بازیابی کنید. دیتابیس خالی به‌صورت خودکار با سه خبر اولیه مقداردهی می‌شود.

App را روی یک replica نگه دارید. Volume را روی دیسک محلی پایدار بگذارید و ظرفیت آن را با توجه به رشد تصاویر کنترل کنید. برای چند میزبان، دسترس‌پذیری بالا یا حجم زیاد نوشتن هم‌زمان، انتقال دیتابیس به PostgreSQL را جداگانه برنامه‌ریزی کنید.

از SQLite Online Backup API یا دستور `.backup` برای تهیهٔ نسخهٔ سازگار هنگام اجرای سرویس استفاده کنید. کپی فایل اصلی به‌تنهایی در حالت WAL ممکن است آخرین تغییرات را جا بیندازد. نمونهٔ زیر بکاپ را روی میزبان می‌گیرد. فایل خروجی را با دسترسی محدود خارج از میزبان هم نگه دارید و بازیابی را آزمایش کنید.

```sh
umask 077
docker compose --env-file /secure/efarda/production.env exec -T app node --input-type=module -e '
  import { DatabaseSync, backup } from "node:sqlite";
  const db = new DatabaseSync(process.env.EFARDA_DB_PATH, { readOnly: true });
  await backup(db, "/tmp/efarda-backup.sqlite");
  db.close();
'
docker compose --env-file /secure/efarda/production.env cp app:/tmp/efarda-backup.sqlite "./efarda-$(date +%Y%m%d-%H%M%S).sqlite"
docker compose --env-file /secure/efarda/production.env exec -T app node -e 'require("node:fs").unlinkSync("/tmp/efarda-backup.sqlite")'
```

بازیابی را با سرویس متوقف روی یک volume جدید انجام دهید. فایل را با مالک UID 1000 و مجوز 0600 در مسیر `/var/lib/efarda/site.sqlite` قرار دهید، `EFARDA_DB_VOLUME` را به volume جدید تغییر دهید و سپس سرویس را بالا بیاورید. برای انتشار نسخه‌های بعدی ابتدا بکاپ بگیرید و همان volume را نگه دارید.

پیش از تغییر DNS، یا در تست پس از برقراری HTTPS، صفحهٔ فارسی و انگلیسی، ورود مدیر، بارگذاری تصویر، اعلان ورود و بازیابی رمز را با SMTP واقعی بررسی کنید.
