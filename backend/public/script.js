async function startPayment(filePath, btn) {
  try {
    // ✅ Backend se Razorpay order create karo
    const res = await fetch("https://unique-1.onrender.com/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 70 }) // Rs.70 => 7000 paisa backend me handle ho raha hoga
    });

    const order = await res.json();
    console.log("Order created:", order);

    // ✅ Razorpay Checkout open karo
    const options = {
      key: "rzp_live_R9vO4222DeaOxA",
      amount: order.amount,          // backend se amount
      currency: "INR",
      name: "Exam Notes Hub",
      description: "Buy Notes",
      order_id: order.id,           // ✅ Razorpay order_id
      handler: function (response) {
        // ✅ Payment success
        btn.style.display = "none";

        // ✅ Download button dikhana
        const downloadBtn = btn.parentElement.querySelector(".download-btn");
        if (downloadBtn) {
          downloadBtn.style.display = "inline-block";
        }

        alert("✅ Payment Successful! अब आप डाउनलोड कर सकते हैं।");

        setTimeout(() => {
          goHome();
        }, 1500);
      },
      modal: {
        ondismiss: function () {
          goHome();
        }
      },
      prefill: {
        name: "Student",
        email: "student@example.com",
        contact: "9999999999"
      },
      theme: { color: "#3399cc" }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  } catch (err) {
    console.error("Payment Error:", err);
    alert("Something went wrong!");
  }
}

// ✅ Share button logic (same as before)
document.getElementById("shareBtn").addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Exam Notes Hub",
        text: "मैं Exam Notes Hub से सस्ते दामों में सभी प्रतियोगी परीक्षाओं की नोट्स ले रहा हूँ, आप भी देखो 📚🔥",
        url: window.location.href
      });
      console.log("✅ Shared successfully");
    } catch (err) {
      console.log("❌ Error sharing: ", err);
    }
  } else {
    alert("Sharing not supported on this browser!");
  }
});

// ✅ goHome function
function goHome() {
  document.getElementById("detailsPopup")?.style?.display = "none";
  document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  window.history.pushState({ page: "home" }, "", "");
}
