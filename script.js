
document.addEventListener("DOMContentLoaded", () => {

    // MOBIL MENYU
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");

    if (hamburger && navMenu) {

        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
            });
        });
    }


    // SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const target = document.querySelector(
                link.getAttribute("href")
            );

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });


    // BUYURTMA FORMASI
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    // Backend manzili keyin Render yoki boshqa serverga
    // joylashtirilgandan so'ng shu yerga yoziladi.
    const API_URL = "";

    if (contactForm) {

        contactForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const name = document.getElementById("customerName").value.trim();
            const phone = document.getElementById("customerPhone").value.trim();
            const service = document.getElementById("customerService").value;
            const message = document.getElementById("customerMessage").value.trim();

            if (!name || !phone || !service) {
                formStatus.textContent = "Barcha majburiy maydonlarni to‘ldiring!";
                return;
            }

            if (!API_URL) {
                formStatus.textContent =
                    "Buyurtma tizimi hali serverga ulanmagan. Tez orada ishga tushadi.";

                return;
            }

            const submitButton = contactForm.querySelector(
                'button[type="submit"]'
            );

            submitButton.disabled = true;
            submitButton.textContent = "Yuborilmoqda...";

            try {

                const response = await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        phone,
                        service,
                        message
                    })

                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Buyurtma yuborilmadi"
                    );
                }

                formStatus.textContent =
                    "Buyurtmangiz muvaffaqiyatli yuborildi!";

                contactForm.reset();

            } catch (error) {

                formStatus.textContent =
                    "Xatolik yuz berdi. Keyinroq qayta urinib ko‘ring.";

                console.error("NEXORA IT:", error);

            } finally {

                submitButton.disabled = false;
                submitButton.textContent = "Buyurtma yuborish";

            }

        });

    }

});
