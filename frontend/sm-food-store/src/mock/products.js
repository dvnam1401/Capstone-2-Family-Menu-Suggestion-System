// src/mock/products.js
const products = [
    {
      id: 1,
      name: "Ba chỉ heo Nga Ace Foods 300g",
      slug: "ba-chi-heo-nga-ace-foods-300g",
      category: "Thịt heo",
      categoryId: 1,
      description: "Thịt ba chỉ heo Nga được chọn lọc kỹ càng, đảm bảo độ tươi ngon và chất lượng cao. Thịt có độ dày vừa phải, thớ thịt mềm mịn, thơm ngon và béo vừa đủ. Lớp mỡ và thịt xen kẽ nhau tạo nên hương vị đặc trưng của thịt ba chỉ. Sản phẩm được đóng gói kỹ càng, đảm bảo vệ sinh an toàn thực phẩm.",
      shortDescription: "Ready to cook, sản phẩm được xử chế tươi tại cơ thể nhà ngay, sản phẩm nhập khẩu chính ngạch từ Nga",
      originalPrice: 42600,
      discountPrice: 28000,
      images: [
        "/assets/products/pork-belly-1.jpg",
        "/assets/products/pork-belly-2.jpg",
        "/assets/products/pork-belly-3.jpg",
      ],
      inStock: true,
      rating: 4.5,
      reviewCount: 263,
      specifications: [
        {
          name: "Xuất xứ",
          value: "Nga"
        },
        {
          name: "Trọng lượng",
          value: "300g"
        },
        {
          name: "Bảo quản",
          value: "Bảo quản ở nhiệt độ 0-4°C"
        },
        {
          name: "Hạn sử dụng",
          value: "7 ngày kể từ ngày sản xuất"
        }
      ],
      reviews: [
        {
          user: "Darrell Steward",
          date: "July 23, 2023 12:01 PM",
          rating: 5,
          content: "This is amazing product! I have used it for a week and I am very satisfied with the quality."
        },
        {
          user: "Darlene Robertson",
          date: "July 20, 2023 10:23 AM",
          rating: 4,
          content: "This is amazing product! I have used it for a week and I am very satisfied with the quality."
        },
        {
          user: "Kathryn Murphy",
          date: "July 15, 2023 09:15 AM",
          rating: 5,
          content: "This is amazing product! I have used it for a week and I am very satisfied with the quality."
        },
        {
          user: "Ronald Richards",
          date: "July 10, 2023 08:20 AM",
          rating: 5,
          content: "This is amazing product! I have used it for a week and I am very satisfied with the quality."
        }
      ]
    },
    {
      id: 2,
      name: "Thịt bò Úc cắt lát 300g",
      slug: "thit-bo-uc-cat-lat-300g",
      category: "Thịt bò",
      categoryId: 2,
      description: "Thịt bò Úc là một trong những loại thịt bò chất lượng cao trên thế giới. Thịt có màu đỏ tươi, thớ mịn, ít mỡ và rất mềm. Thịt bò Úc được nuôi trên những cánh đồng cỏ rộng lớn, tự nhiên nên có hương vị đặc trưng, thơm ngon. Sản phẩm đã được cắt lát sẵn, tiện lợi cho việc chế biến.",
      shortDescription: "Thịt bò Úc chất lượng cao, cắt lát sẵn, tiện lợi cho việc chế biến. Thịt có màu đỏ tươi, thớ mịn, ít mỡ và rất mềm.",
      originalPrice: 95000,
      discountPrice: 85000,
      images: [
        "/assets/products/beef-slices-1.jpg",
        "/assets/products/beef-slices-2.jpg",
        "/assets/products/beef-slices-3.jpg",
      ],
      inStock: true,
      rating: 4.8,
      reviewCount: 158,
      specifications: [
        {
          name: "Xuất xứ",
          value: "Úc"
        },
        {
          name: "Trọng lượng",
          value: "300g"
        },
        {
          name: "Bảo quản",
          value: "Bảo quản ở nhiệt độ 0-4°C"
        },
        {
          name: "Hạn sử dụng",
          value: "5 ngày kể từ ngày sản xuất"
        }
      ],
      reviews: [
        {
          user: "Darrell Steward",
          date: "July 25, 2023 03:30 PM",
          rating: 5,
          content: "Beef quality is excellent. Very tender and tasty!"
        },
        {
          user: "Darlene Robertson",
          date: "July 22, 2023 09:45 AM",
          rating: 5,
          content: "Perfect for my stir-fry dishes. Will buy again!"
        }
      ]
    },
    {
      id: 3,
      name: "Cá hồi fillet 250g",
      slug: "ca-hoi-fillet-250g",
      category: "Cá, hải sản",
      categoryId: 3,
      description: "Cá hồi fillet là phần thịt cá hồi được lọc bỏ xương, da (tùy theo yêu cầu) tạo nên miếng thịt cá hồi nguyên thớ. Cá hồi có hàm lượng dinh dưỡng cao, đặc biệt giàu omega-3, DHA, EPA tốt cho sức khỏe tim mạch, não bộ và thị lực. Thịt cá hồi mềm, béo ngậy với màu cam đặc trưng rất hấp dẫn.",
      shortDescription: "Cá hồi fillet tươi ngon, giàu omega-3, đã được làm sạch và fillet sẵn, thuận tiện cho việc chế biến.",
      originalPrice: 100000,
      discountPrice: 90000,
      images: [
        "/assets/products/salmon-fillet-1.jpg",
        "/assets/products/salmon-fillet-2.jpg",
        "/assets/products/salmon-fillet-3.jpg",
      ],
      inStock: true,
      rating: 4.7,
      reviewCount: 124,
      specifications: [
        {
          name: "Xuất xứ",
          value: "Na Uy"
        },
        {
          name: "Trọng lượng",
          value: "250g"
        },
        {
          name: "Bảo quản",
          value: "Bảo quản ở nhiệt độ 0-2°C"
        },
        {
          name: "Hạn sử dụng",
          value: "3 ngày kể từ ngày đóng gói"
        }
      ],
      reviews: [
        {
          user: "Cameron Williamson",
          date: "July 24, 2023 05:15 PM",
          rating: 5,
          content: "Fresh salmon with great taste. Perfect for my sushi!"
        },
        {
          user: "Leslie Alexander",
          date: "July 20, 2023 11:30 AM",
          rating: 4,
          content: "Good quality but slightly smaller than expected."
        }
      ]
    },
    {
      id: 4,
      name: "Trứng gà tươi hộp 10 quả",
      slug: "trung-ga-tuoi-hop-10-qua",
      category: "Trứng gà, vịt, cút",
      categoryId: 4,
      description: "Trứng gà tươi từ những trang trại chăn nuôi an toàn, đảm bảo chất lượng. Trứng có vỏ cứng, màu sắc đồng đều, khi đập ra lòng đỏ trứng căng tròn, đặc, màu vàng đậm và lòng trắng trong, đặc quánh. Trứng gà là thực phẩm giàu protein, vitamin và khoáng chất cần thiết cho cơ thể.",
      shortDescription: "Trứng gà tươi từ trang trại, đảm bảo chất lượng và an toàn vệ sinh thực phẩm.",
      originalPrice: 32000,
      discountPrice: null,
      images: [
        "/assets/products/eggs-1.jpg",
        "/assets/products/eggs-2.jpg",
        "/assets/products/eggs-3.jpg",
      ],
      inStock: true,
      rating: 4.6,
      reviewCount: 89,
      specifications: [
        {
          name: "Xuất xứ",
          value: "Việt Nam"
        },
        {
          name: "Số lượng",
          value: "10 quả/hộp"
        },
        {
          name: "Bảo quản",
          value: "Bảo quản ở nhiệt độ phòng hoặc ngăn mát tủ lạnh"
        },
        {
          name: "Hạn sử dụng",
          value: "15 ngày kể từ ngày đóng gói"
        }
      ],
      reviews: [
        {
          user: "Jacob Jones",
          date: "July 22, 2023 08:45 AM",
          rating: 5,
          content: "Fresh eggs with bright yellow yolks. Excellent quality!"
        },
        {
          user: "Esther Howard",
          date: "July 18, 2023 07:20 PM",
          rating: 4,
          content: "Good eggs but one was broken upon delivery."
        }
      ]
    },
    {
      id: 5,
      name: "Chuối Cavendish 1kg",
      slug: "chuoi-cavendish-1kg",
      category: "Trái cây",
      categoryId: 5,
      description: "Chuối Cavendish là giống chuối được trồng phổ biến trên thế giới. Quả chuối có vỏ màu xanh khi còn sống và chuyển sang màu vàng khi chín. Thịt chuối màu trắng ngà, mềm, ngọt với hương thơm đặc trưng. Chuối là loại trái cây giàu kali, vitamin C, B6 và chất xơ, tốt cho sức khỏe tim mạch và hệ tiêu hóa.",
      shortDescription: "Chuối Cavendish tươi ngon, ngọt, mềm, giàu dinh dưỡng. Trái chuối to, đều, vỏ vàng, không bị thâm.",
      originalPrice: 35000,
      discountPrice: 30000,
      images: [
        "/assets/products/bananas-1.jpg",
        "/assets/products/bananas-2.jpg",
        "/assets/products/bananas-3.jpg",
      ],
      inStock: true,
      rating: 4.3,
      reviewCount: 72,
      specifications: [
        {
          name: "Xuất xứ",
          value: "Việt Nam"
        },
        {
          name: "Trọng lượng",
          value: "1kg (khoảng 5-7 trái)"
        },
        {
          name: "Bảo quản",
          value: "Bảo quản ở nhiệt độ phòng, tránh ánh nắng trực tiếp"
        },
        {
          name: "Hạn sử dụng",
          value: "3-5 ngày kể từ ngày mua"
        }
      ],
      reviews: [
        {
          user: "Brooklyn Simmons",
          date: "July 21, 2023 10:10 AM",
          rating: 5,
          content: "Sweet and perfectly ripe bananas. Great value!"
        },
        {
          user: "Jenny Wilson",
          date: "July 19, 2023 03:45 PM",
          rating: 3,
          content: "Bananas were a bit green when arrived, had to wait for them to ripen."
        }
      ]
    }
  ];
  
  export default products;