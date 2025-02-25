import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, TextField } from '@mui/material';
import Image from 'next/image';
import { IoSearch } from "react-icons/io5";
import Swal from 'sweetalert2'
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdAdd } from 'react-icons/md';
import axios from '../../../axios';
import { getAllBannerData, getCategories, getProducts, getSubCategories, getSuperSubCategories } from '../api';
import { Autocomplete, Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSnackbar } from '../SnackbarProvider';
import { useRouter } from 'next/navigation';

const Banners = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter()

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleProductChange = (event, value) => {
    setSelectedProducts(value);
  };

  const [itemType, setItemType] = useState('');

  const [getAllProducts, setGetAllProducts1] = useState([])
  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setGetAllProducts1(productsData.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = getAllProducts.filter(product => product.status === 1);

  // const [getAllCategories, setGetAllCategories] = useState([])
  // const fetchCategory = async () => {
  //   try {
  //     const categoryData = await getCategories();
  //     setGetAllCategories(categoryData.categories);
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   }
  // };

  // const [getAllSubCategories, setGetAllSubCategories] = useState([])
  // const fetchSubCategory = async () => {
  //   try {
  //     const subCatgeoryData = await getSubCategories();
  //     setGetAllSubCategories(subCatgeoryData.subcategories);
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   }
  // };

  // const [getAllSuperSubCategories, setGetAllSuperSubCategories] = useState([])
  // const fetchSuperSubCategory = async () => {
  //   try {
  //     const superSubCategoryData = await getSuperSubCategories();
  //     setGetAllSuperSubCategories(superSubCategoryData.superSubcategories);
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   }
  // };

  // ----------------------------------------------Fetch Category section Starts-----------------------------------------------------
  const [categoryData, setCategoryData] = useState([])
  const [selectedCategory , setSelectedCategory] = useState(null)
  console.log(selectedCategory)
  const fetchCategory = async () => {
    try {
      const getAllcategoryData = await getCategories();
      setCategoryData(getAllcategoryData.categories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // ----------------------------------------------Fetch Category section Ends-----------------------------------------------------

  // ----------------------------------------------Fetch Sub Category section Starts-----------------------------------------------------
  const [subCategoryData, setSubCategoryData] = useState([])
  const [selectedSubCategory , setSelectedSubCategory] = useState(null)
  useEffect(() => {
    setSelectedSubCategory(null)
    setSelectedSuperSubCategory(null)
    if (document.getElementById('sub_category_id')) {
      document.getElementById('sub_category_id').value = '';
    }
    if (document.getElementById('super_sub_category_id')) {
      document.getElementById('super_sub_category_id').value = '';
    }
    if (selectedCategory) {
      fetchSubCategoryData(selectedCategory);
    }
  }, [selectedCategory]);

 
  const fetchSubCategoryData = useCallback(
    (selectedCategory) => {
      axios.get(`/api/fetch-subcategories?category_id=${selectedCategory}`,{
        headers : {
          Authorization : localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setSubCategoryData(res.data.subcategories)
          } else if (res.data.message === 'Session expired') {
            openSnackbar(res.data.message, 'error');
            router.push('/login')
          }
        })
        .catch(err => {
          console.log(err)
          if (err.response && err.response.data.statusCode === 400) {
            openSnackbar(err.response.data.message, 'error');
          }
        })
    },
    [],
  )
  // ----------------------------------------------Fetch Sub Category section Ends-----------------------------------------------------


  // ----------------------------------------------Fetch Super Sub Category section Starts-----------------------------------------------------
  const [superSubCategoryData, setSuperSubCategoryData] = useState([])
  const [selectedSuperSubCategory , setSelectedSuperSubCategory] = useState(null)
  useEffect(() => {
    setSelectedSuperSubCategory(null)
    if (document.getElementById('super_sub_category_id')) {
      document.getElementById('super_sub_category_id').value = ''
    }
    if (selectedSubCategory) {
      fetchSuperSubCategoryData(selectedSubCategory);
    }
  }, [selectedSubCategory]);


  const fetchSuperSubCategoryData = useCallback(
    (selectedSubCategory) => {
      axios.get(`/api/fetch-supersubcategories?sub_category_id=${selectedSubCategory}`,{
        headers : {
          Authorization : localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setSuperSubCategoryData(res.data.superSubcategories)
          } else if (res.data.message === 'Session expired') {
            openSnackbar(res.data.message, 'error');
            router.push('/login')
          }
        })
        .catch(err => {
          console.log(err)
          if (err.response && err.response.data.statusCode === 400) {
            openSnackbar(err.response.data.message, 'error');
          }
        })
    },
    [],
  )
  
  // ----------------------------------------------Fetch Super Sub Category section Ends-----------------------------------------------------


  const [getAllBanners, setGetAllBanners] = useState([])

  const fetchBanner = async () => {
    try {
      const bannerData = await getAllBannerData();
      console.log('banner', bannerData)
      setGetAllBanners(bannerData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  // ---------------------------------image section---------------------------------
  const fileInputRefWebsite = useRef(null);
  const fileInputRefMobile = useRef(null);
  const [uploadedImageWebsite, setUploadedImageWebsite] = useState(null);
  const [uploadedImageMobile, setUploadedImageMobile] = useState(null);
  const [imageWeb, setImageWeb] = useState({})
  const [imageMob, setImageMob] = useState({})

  const handleButtonClickWebsite = () => {
    fileInputRefWebsite.current.click();
  };

  const handleButtonClickMobile = () => {
    fileInputRefMobile.current.click();
  };


  const handleFileChangeWebsite = (e) => {

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageWeb(file);
        setUploadedImageWebsite(e.target.result)
      };
      reader.readAsDataURL(file);
    }
    // const file = e.target.files[0];
    // if (!file) {
    //   return;
    // }

    // const reader = new FileReader();

    // if (file.size > 2 * 1024 * 1024) {
    //   openSnackbar("Please upload an image with size less than 2MB.", 'error');
    //   e.target.value = null;
    //   return;
    // }


    // reader.onload = (e) => {
    //   const img = document.createElement('img');
    //   img.src = e.target.result;

    //   img.onload = () => {
    //     if (img.width === 1370 && img.height === 532) {
    //       setUploadedImageWebsite(e.target.result);
    //       setImageWeb(file);
    //     } else {
    //       openSnackbar("Please upload an image with dimensions 1370 × 532 pixels.", 'error');
    //       e.target.value = null;
    //       setUploadedImageWebsite(null);
    //       setImageWeb({});
    //     }
    //   };
    // };

    // reader.readAsDataURL(file);
  };

  const handleFileChangeMobile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    if (file.size > 2 * 1024 * 1024) {
      openSnackbar("Please upload an image with size less than 2MB.", 'error');
      e.target.value = null;
      return;
    }

    reader.onload = (e) => {
      setUploadedImageMobile(e.target.result);
      setImageMob(file)
    };

    reader.readAsDataURL(file);
  };

  const handleImageRemoveWebsite = () => {
    setUploadedImageWebsite(null);
    setImageWeb({})
    if (fileInputRefWebsite.current) {
      fileInputRefWebsite.current.value = null;
    }
  };

  const handleImageRemoveMobile = () => {
    setUploadedImageMobile(null);
    setImageMob({})
    if (fileInputRefMobile.current) {
      fileInputRefMobile.current.value = null;
    }
  };


  // ----------------------------------------------Fetch Banner section Starts-----------------------------------------------------
  const [attributeData, setAttributeData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      // fetchAttributeData()
      fetchProducts()
      fetchCategory()
      // fetchSubCategory()
      // fetchSuperSubCategory()
      fetchBanner()
    }

    return () => { unmounted = true };
  }, [])

  // const fetchAttributeData = useCallback(
  //   () => {
  //     axios.get('/api/fetch-all-attributes', {
  //       headers: {
  //         Authorization: localStorage.getItem('kardifyAdminToken')
  //       }
  //     })
  //       .then((res) => {
  //         if (res.data.status === 'success') {
  //           setAttributeData(res.data.attributes)
  //         }
  //       })
  //       .then(err => {
  //         console.log(err)
  //       })
  //   },
  //   [],
  // )

  // ----------------------------------------------Fetch Banner section Ends-----------------------------------------------------

  const [page, setPage] = useState(1);
  //const allBannerData = [...getAllBanners]
  const rowsPerPage = 5;
  const totalRows = getAllBanners.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = getAllBanners.filter((e) =>
    e.banner_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // --------------------------------- Add Banner Section Starts------------------------------------
  const [bannerDetails, setBannerDetails] = useState({
    banner_name: '',
    category_id: '',
    sub_category_id: '',
    super_sub_category_id: ''
  })

  const getData = (e) => {
    const { value, name } = e.target;

    setBannerDetails(() => {
      return {
        ...bannerDetails,
        [name]: value
      }
    })
  }

  const addBanner = () => {
    if (!bannerDetails.banner_name) {
      openSnackbar('Enter Banner Name', 'error')
      return;
    }
    if (itemType === 'Products') {
      // if (!imageMob.name || !imageWeb.name) {
      //   openSnackbar('Choose Image for both Web And Mobile', 'error')
      //   return;
      // }
      const formData = new FormData();
      formData.append('banner_name', bannerDetails.banner_name);
      //formData.append('banner_type', 'product');
      formData.append('banner_url', imageWeb);
      //formData.append('mob_image_url', imageMob);

      const productIdsArray = selectedProducts.map(product => product.id);
      formData.append('product_ids', JSON.stringify(productIdsArray));

      axios.post('/api/v1/banners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('madhuitAdminToken')
        }
      })
        .then(res => {
          console.log(res);
          if (res.data.status === 'success') {
            openSnackbar(res.data.message, 'success')
            fetchBanner()
            resetData()
          } else if (res.data.message === 'Session expired') {
            router.push('/login')
            openSnackbar(res.data.message, 'error')
          } else {
            openSnackbar(res.data.message, 'error')
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    else if (itemType === 'Category') {
      if (!imageMob.name || !imageWeb.name) {
        openSnackbar('Choose Image for both Web And Mobile', 'error')
        return;
      }

      if (!selectedCategory) {
        openSnackbar('Choose Category', 'error')
      }
      const formData = new FormData();
      formData.append('banner_name', bannerDetails.banner_name);
      formData.append('banner_type', 'category');
      formData.append('category_id', selectedCategory);
      if (selectedSubCategory) {
        formData.append('sub_category_id', selectedSubCategory);
      }
      if (selectedSuperSubCategory) {
        formData.append('super_sub_category_id', selectedSuperSubCategory);
      }
      formData.append('web_image_url', imageWeb);
      formData.append('mob_image_url', imageMob);

      axios.post('/api/add-banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then(res => {
          if (res.data.status === 'success') {
            openSnackbar(res.data.message, 'success')
            fetchBanner()
            resetData()
          } else if (res.data.message === 'Session expired') {
            router.push('/login')
            openSnackbar(res.data.message, 'error')
          } else {
            openSnackbar(res.data.message, 'error')
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      openSnackbar('Please Select any banner type', 'error');
    }
  }

  const resetData = () => {
    setItemType('')
    setImageMob({})
    setImageWeb({})
    setSelectedProducts([])
    setBannerDetails({
      banner_name: '',
      category_id: '',
      sub_category_id: '',
      super_sub_category_id: ''
    })
    setUploadedImageMobile(null)
    setUploadedImageWebsite(null)
    document.getElementById('item_type').value = ''
    document.getElementById('banner_name').value = ''
    if (itemType === 'Category') {
      document.getElementById('category_id').value = ''
      document.getElementById('sub_category_id').value = ''
      document.getElementById('super_sub_category_id').value = ''
    }

  }

  // --------------------------------- Add Banner Section Ends------------------------------------

  // --------------------------------- Delete Banner Section Starts------------------------------------

  const deleteBanner = (data) => {
    Swal.fire({
      title: "Delete",
      text: `Do you want to Delete this ${data.banner_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/delete-banner?banner_id=${data.id}`, {}, {
          headers: {
            Authorization: localStorage.getItem('kardifyAdminToken')
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              fetchBanner()
              openSnackbar(res.data.message, 'success');
              if (page > 1 && paginatedRows.length === 1) {
                setPage(page - 1);
              }
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    });
  };

  // --------------------------------- Delete Banner Section Ends------------------------------------

  // ----------------------------------------------Change status section Starts-----------------------------------------------------
  const handleSwitchChange = (id) => {
    axios.post(`/api/toggle-banner-status?banner_id=${id}`, {}, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken')
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchBanner()
        }
      })
      .catch(err => {
        console.log(err)
      })
  };
  // ----------------------------------------------Change status section Ends-----------------------------------------------------

  const [isEditable, setIsEditable] = useState(false)
  const [editData, setEditData] = useState({})

  const handleEdit = (data) => {
    setEditData(data)
    setIsEditable(true)
  }

  const resetButton = () => {
    setIsEditable(false)
    fetchProducts()
  }

  return (
    <div className='px-[20px]  container mx-auto overflow-y-scroll'>
      {!isEditable ?
        <div className=' py-[10px] flex flex-col space-y-5'>
          <div className='flex flex-col space-y-1'>
            <span className='text-[30px] text-[#101828] font-[500]'>Banners Setup</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Elevate Visual Impact with Intuitive Banner Configuration in Admin Applications.</span>
          </div>

          <div className='grid grid-cols-3 gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Title *</span>
              <input type='text' placeholder='Enter Banner Name' value={bannerDetails.banner_name} className='inputText' id='banner_name' name='banner_name' onChange={getData} />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Item Type *</span>
              <select name='item_type' id='item_type' onChange={(e) => setItemType(e.target.value)}>
                <option>Choose Item Type</option>
                <option>Products</option>
                <option>Category</option>
              </select>
            </div>
            {itemType === 'Category' && (
              <>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Select Category *</span>
                  <select name='category_id' id='category_id' onChange={e => setSelectedCategory(e.target.value)}>
                    <option value=''>Choose Category</option>
                    {categoryData && categoryData.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.category_name}</option>
                    )}
                  </select>
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Select Sub Category *</span>
                  <select name='sub_category_id' id='sub_category_id' onChange={e => setSelectedSubCategory(e.target.value)}>
                    <option value=''>Choose Sub Category</option>
                    {subCategoryData && subCategoryData.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.sub_category_name}</option>
                    )}
                  </select>
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Select Super Sub Category *</span>
                  <select name='super_sub_category_id' id='super_sub_category_id' onChange={e => setSelectedSuperSubCategory(e.target.value)}>
                    <option value=''>Choose Super Sub Category</option>
                    {superSubCategoryData && superSubCategoryData.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.super_sub_category_name}</option>
                    )}
                  </select>
                </div>
              </>
            )}
            {itemType === 'Products' && (
              <div className='flex flex-col space-y-1 w-full'>
                <span>Select Product </span>
                <FormControl fullWidth>
                  <Autocomplete
                    multiple
                    options={filteredProducts}
                    getOptionLabel={(option) => option.product_name}
                    value={selectedProducts}
                    onChange={handleProductChange}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox color="primary" checked={selected} />
                        {option.product_name}
                      </li>
                    )}
                    style={{ width: '100%' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Products"
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
              </div>
            )}
          </div>

          <div className='flex items-baseline justify-between gap-[30px]'>
            <div className='flex flex-col space-y-2  w-[100%]'>
              <span className='text-[18px] font-[600]'>Website banner</span>
              <span className='text-red-600 font-[400] text-[10px]'>Note: Only .png, .jpg, .jpeg format supported (Max. 2MB) (Dimesions : 1370px × 532px)</span>
              <div className="flex flex-col items-center justify-center text-[16px]">
                <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                  <div className="text-[40px]">
                    <FaCloudUploadAlt />
                  </div>
                  <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                  <span className="mt-2 text-[10px] font-bold">OR</span>
                  <button
                    className=" text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                    onClick={handleButtonClickWebsite}
                  >
                    Click to Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRefWebsite}
                    className="hidden"
                    onChange={handleFileChangeWebsite}
                    accept='image/*'
                  />
                </div>
                <div className="flex flex-wrap items-center mt-3">
                  {uploadedImageWebsite && (
                    <div className="p-2 relative">
                      <img src={uploadedImageWebsite} alt="Uploaded Website Banner" className="max-w-[80px] max-h-[80px]" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        onClick={handleImageRemoveWebsite}
                      >
                        <FaTimes className='text-[10px]' />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* <div className='flex flex-col space-y-2  w-[100%]'>
              <span className='text-[18px] font-[600]'>Mobile banner</span>
              <span className='text-red-600 font-[400] text-[10px]'>Note: Only .png, .jpg, .jpeg format supported (Max. 2MB)</span>
              <div className="flex flex-col items-center justify-center text-[16px]">
                <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                  <div className="text-[40px]">
                    <FaCloudUploadAlt />
                  </div>
                  <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                  <span className="mt-2 text-[10px] font-bold">OR</span>
                  <button
                    className=" text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                    onClick={handleButtonClickMobile}
                  >
                    Click to Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRefMobile}
                    className="hidden"
                    onChange={handleFileChangeMobile}
                    accept='image/*'
                  />
                </div>
                <div className="flex flex-wrap items-center mt-3">
                  {uploadedImageMobile && (
                    <div className="p-2 relative">
                      <img src={uploadedImageMobile} alt="Uploaded Website Banner" className="max-w-[80px] max-h-[80px]" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        onClick={handleImageRemoveMobile}
                      >
                        <FaTimes className='text-[10px]' />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div> */}
          </div>

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton' onClick={resetData}>Reset</span>
            <span className='submitButton' onClick={addBanner}>Submit</span>
          </div>


          <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
            <div className='flex items-center px-3 justify-between'>
              <div className='flex space-x-2 items-center'>
                <span className='text-[18px] font-[500] text-[#101828]'>Banners</span>
                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{getAllBanners.length} Banners</span>
              </div>
              <div className='flex items-center space-x-3 inputText'>
                <IoSearch className='text-[20px]' />
                <input
                  type='text'
                  className='outline-none focus-none'
                  placeholder='Search here'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table content here */}
            <Paper >
              <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow className='!bg-[#F9FAFB]'>
                      {/* Define your table header columns */}
                      <TableCell style={{ minWidth: 50 }}>Sl No</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Title</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Website Banner</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Mobile Banner</TableCell>
                      <TableCell style={{ minWidth: 100 }}>Status</TableCell>
                      <TableCell style={{ minWidth: 50 }}>Change Status</TableCell>
                      <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                      {/* <TableCell style={{ minWidth: 50 }}>Edit</TableCell> */}
                    </TableRow>
                  </TableHead>
                  {filteredRows.length > 0 ?
                    <TableBody>
                      {paginatedRows.map((row, i) => (
                        <TableRow key={i} >
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>
                            {row.banner_name}
                          </TableCell>
                          <TableCell>
                            <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.banner_url}`} width={60} height={60} alt={row.banner_name} className='rounded-[8px] h-[60px] w-[100px]' />
                          </TableCell>
                          <TableCell>
                            <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.banner_url}`} width={60} height={60} alt={row.banner_name} className='rounded-[8px] h-[60px] w-[100px]' />
                          </TableCell>
                          <TableCell >
                            {row.status == true ?
                              <div className='flex items-center gap-[5px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center'>
                                <Image src="/images/active.svg" height={10} width={10} alt='active' />
                                <span className='text-[#027A48] text-[12px] font-[500]'>Active</span>
                              </div> :
                              <div className='flex items-center gap-[5px] py-[5px] bg-red-200 rounded-[16px] justify-center'>
                                <Image src="/images/inactive.svg" height={10} width={10} alt='active' />
                                <span className='text-red-500 text-[12px] font-[500]'>Inactive</span>
                              </div>
                            }
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={row.status == true}
                              onChange={() => handleSwitchChange(row.id)}
                              inputProps={{ 'aria-label': 'controlled' }}
                              sx={{
                                '& .MuiSwitch-thumb': {
                                  backgroundColor: row.status == true ? '#CFAA4C' : '',
                                },
                                '& .Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#CFAA4C',
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell ><FaRegTrashAlt className='cursor-pointer' onClick={() => deleteBanner(row)} /></TableCell>
                          {/* <TableCell><FaEdit className='cursor-pointer' onClick={() => handleEdit(row)} /></TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                    :
                    <TableRow>
                      <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Banner found</TableCell>
                    </TableRow>
                  }
                </Table>
              </TableContainer>
            </Paper>

            {filteredRows.length > rowsPerPage && (
              <div className='flex justify-center mt-3'>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  shape="rounded"
                />
              </div>
            )}
          </div>

        </div>
        :
        <span>Edit</span>
      }
      {/* edit section commented */}
      {/* <div className=' py-[10px] flex flex-col space-y-5'>
          <div className='flex flex-col space-y-1'>
            <span className='text-[30px] text-[#101828] font-[500]'>Banners Setup</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Elevate Visual Impact with Intuitive Banner Configuration in Admin Applications.</span>
          </div>

          <div className='grid grid-cols-3 gap-4 gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Title *</span>
              <input type='text' placeholder='Horn' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Item Type *</span>
              <select name='category_id' >
                <option>Choose Category</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Select Category *</span>
              <select name='category_id' >
                <option>Choose Category</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Select Sub Category *</span>
              <select name='category_id' >
                <option>Choose Category</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Select Super Sub Category *</span>
              <select name='category_id' >
                <option>Choose Category</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Select Product *</span>
              <select name='category_id' >
                <option>Choose Category</option>
              </select>
            </div>
          </div>

          <div className='flex items-center justify-between gap-[30px]'>
            <div className='flex flex-col space-y-2  w-[100%]'>
              <span className='text-[18px] font-[600]'>Website banner</span>
              <div className="flex flex-col items-center justify-center text-[16px]">
                <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                  <div className="text-[40px]">
                    <FaCloudUploadAlt />
                  </div>
                  <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                  <span className="mt-2 text-[10px] font-bold">OR</span>
                  <button
                    className=" text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                    onClick={handleButtonClick}
                  >
                    Click to Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept='image/*'
                  />
                </div>
                <div className="flex flex-wrap items-center mt-3">
                  {uploadedImages.map((imageDataUrl, index) => (
                    <div key={index} className="p-2 relative">
                      <img src={imageDataUrl} alt={`Uploaded ${index + 1}`} className="max-w-[80px] max-h-[80px]" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        onClick={() => handleImageRemove(index)}
                      >
                        <FaTimes className='text-[10px]' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex flex-col space-y-2  w-[100%]'>
              <span className='text-[18px] font-[600]'>Mobile banner</span>
              <div className="flex flex-col items-center justify-center text-[16px]">
                <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                  <div className="text-[40px]">
                    <FaCloudUploadAlt />
                  </div>
                  <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                  <span className="mt-2 text-[10px] font-bold">OR</span>
                  <button
                    className=" text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                    onClick={handleButtonClick}
                  >
                    Click to Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept='image/*'
                  />
                </div>
                <div className="flex flex-wrap items-center mt-3">
                  {uploadedImages.map((imageDataUrl, index) => (
                    <div key={index} className="p-2 relative">
                      <img src={imageDataUrl} alt={`Uploaded ${index + 1}`} className="max-w-[80px] max-h-[80px]" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        onClick={() => handleImageRemove(index)}
                      >
                        <FaTimes className='text-[10px]' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton' onClick={resetButton}>Reset</span>
            <span className='submitButton'>Submit</span>
          </div>
        </div> */}
    </div>
  )
}

export default Banners