// THƯ VIỆN ĐỊA ĐIỂM: mỗi thư viện giữ vị trí ảnh riêng.
const cacThuVien = document.querySelectorAll(".thuvien");

for (let i = 0; i < cacThuVien.length; i++) {
    const thuVien = cacThuVien[i];
    const anhChinh = thuVien.querySelector(".anhchinh");
    const nutAnh = thuVien.querySelectorAll(".anhphu button");
    const chuThich = thuVien.querySelector("figcaption");
    let viTriAnh = 0;

    // Lấy ảnh từ nút thu nhỏ; hết ảnh cuối thì quay lại ảnh đầu và ngược lại.
    function hienAnh(viTriMoi) {
        viTriAnh = (viTriMoi + nutAnh.length) % nutAnh.length;
        const nutChon = nutAnh[viTriAnh];
        anhChinh.src = nutChon.querySelector("img").getAttribute("src");
        anhChinh.alt = nutChon.dataset.mota;
        chuThich.textContent = nutChon.dataset.mota + " (" + (viTriAnh + 1) + "/" + nutAnh.length + ")";

        // Đánh dấu ảnh đang xem để CSS tạo viền đỏ gạch cho nút tương ứng.
        for (let j = 0; j < nutAnh.length; j++) {
            nutAnh[j].setAttribute("aria-pressed", j === viTriAnh ? "true" : "false");
        }
    }

    // Bấm ảnh thu nhỏ để chọn trực tiếp ảnh tương ứng.
    for (let j = 0; j < nutAnh.length; j++) {
        nutAnh[j].addEventListener("click", function () {
            hienAnh(j);
        });
    }

    // Hai mũi tên chỉ thay ảnh trong thư viện đang thao tác.
    thuVien.querySelector(".anhtruoc").addEventListener("click", function () {
        hienAnh(viTriAnh - 1);
    });
    thuVien.querySelector(".anhsau").addEventListener("click", function () {
        hienAnh(viTriAnh + 1);
    });
}

// Đổi chữ tiếng Việt thành chữ thường không dấu để tìm kiếm dễ hơn.
function boDau(chu) {
    return chu.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
}

// Lấy form tìm kiếm; chỉ chạy chức năng khi trang có form này.
const formTim = document.querySelector(".timkiem");

if (formTim) {
    // Lấy ô nhập, khung kết quả và các thẻ địa điểm trong HTML.
    const oTim = document.querySelector("#timdiem");
    const ketQua = document.querySelector("#ketqua");
    const baoTim = document.querySelector("#baotim");
    const danhSach = ketQua.querySelector("ul");
    const cacDiem = document.querySelectorAll(".diem");

    // Tìm địa điểm theo từ khóa; xóa kết quả cũ trước mỗi lần tìm.
    function timDiaDiem() {
        const tuKhoa = boDau(oTim.value);
        danhSach.textContent = "";
        ketQua.hidden = !tuKhoa;
        if (!tuKhoa) return;

        // So sánh tên từng địa điểm và tạo các liên kết kết quả phù hợp.
        let soLuong = 0;
        for (let i = 0; i < cacDiem.length; i++) {
            const ten = cacDiem[i].querySelector("h3").textContent;
            if (boDau(ten).includes(tuKhoa)) {
                soLuong++;
                const muc = document.createElement("li");
                const lienKet = document.createElement("a");
                cacDiem[i].id = "diem-tim-" + i;
                lienKet.href = "#" + cacDiem[i].id;
                lienKet.textContent = ten;
                // Đóng kết quả và chuyển focus tới thẻ địa điểm khi chọn.
                lienKet.addEventListener("click", function () {
                    ketQua.hidden = true;
                    cacDiem[i].setAttribute("tabindex", "-1");
                    cacDiem[i].focus({ preventScroll: true });
                });
                muc.appendChild(lienKet);
                danhSach.appendChild(muc);
            }
        }
        baoTim.textContent = soLuong ? "Tìm thấy " + soLuong + " địa điểm" : "Chưa tìm thấy địa điểm phù hợp.";
    }

    // Nhấn Enter hoặc nút tìm: hiển thị kết quả, không tải lại trang.
    formTim.addEventListener("submit", function (event) {
        event.preventDefault();
        timDiaDiem();
    });
    // Cập nhật kết quả khi gõ hoặc quay lại ô tìm kiếm.
    oTim.addEventListener("input", timDiaDiem);
    oTim.addEventListener("focus", timDiaDiem);
    // Nhấn Escape để đóng danh sách kết quả.
    formTim.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            ketQua.hidden = true;
            oTim.focus();
            ketQua.hidden = true;
        }
    });
    // Bấm ngoài form để đóng danh sách kết quả.
    document.addEventListener("click", function (event) {
        if (!formTim.contains(event.target)) ketQua.hidden = true;
    });
}

// Lấy Banner; không chạy phần chuyển ảnh trên trang không có Banner.
const banner = document.querySelector(".banner");

if (banner) {
    // Các nút radio cho biết ảnh đang chọn; boDem lưu bộ đếm tự động.
    const cacAnh = banner.querySelectorAll('input[name="anhbanner"]');
    let boDem;
    let dangReChuot = false;

    // Chọn ảnh kế tiếp, hết ảnh cuối thì quay về ảnh đầu.
    function chuyenAnh() {
        for (let i = 0; i < cacAnh.length; i++) {
            if (cacAnh[i].checked) {
                cacAnh[(i + 1) % cacAnh.length].checked = true;
                break;
            }
        }
    }

    // Xóa bộ đếm cũ để tránh chạy trùng; chuyển ảnh mỗi 2 giây nếu không rê chuột.
    function tuDongChuyen() {
        clearInterval(boDem);
        if (!dangReChuot) {
            boDem = setInterval(chuyenAnh, 2000);
        }
    }

    // Tạm dừng khi con trỏ đi vào Banner.
    banner.addEventListener("mouseenter", function () {
        dangReChuot = true;
        clearInterval(boDem);
    });

    // Khởi động lại bộ đếm khi con trỏ rời Banner.
    banner.addEventListener("mouseleave", function () {
        dangReChuot = false;
        tuDongChuyen();
    });

    // Mũi tên và dấu chấm đều chọn radio; đặt lại thời gian sau khi chọn.
    for (let i = 0; i < cacAnh.length; i++) {
        cacAnh[i].addEventListener("change", tuDongChuyen);
    }

    // Bắt đầu tự chuyển ảnh khi trang tải xong phần HTML.
    tuDongChuyen();
}
// LỌC MÓN ĂN: chỉ chạy trên trang có thanh .locmon, không ảnh hưởng trang khác.
const thanhLocMon = document.querySelector(".locmon");
if (thanhLocMon) {
    const cacNutLoc = thanhLocMon.querySelectorAll("button");
    const cacMon = document.querySelectorAll(".themon");
    const demMon = document.querySelector("#dem-mon");
    thanhLocMon.hidden = false;

    // So sánh data-loai của nút và món; hidden ẩn các món không thuộc nhóm đã chọn.
    for (let i = 0; i < cacNutLoc.length; i++) {
        cacNutLoc[i].addEventListener("click", function () {
            const loaiChon = cacNutLoc[i].dataset.loai;
            let soMon = 0;
            for (let j = 0; j < cacMon.length; j++) {
                const phuHop = loaiChon === "tatca" || cacMon[j].dataset.loai === loaiChon;
                cacMon[j].hidden = !phuHop;
                if (phuHop) soMon++;
            }
            // Cập nhật trạng thái nút và số món để người xem biết kết quả lọc.
            for (let j = 0; j < cacNutLoc.length; j++) {
                cacNutLoc[j].setAttribute("aria-pressed", i === j ? "true" : "false");
            }
            demMon.textContent = soMon + " món · " + cacNutLoc[i].textContent;
        });
    }
}
