import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Form, Card, CardBody, Col, FormControl, FormGroup, FormLabel, Row, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import PageMetaData from '@/components/PageTitle'
import { serverSideFormValidate } from '@/helpers/data'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Product, useGetProduct, useGetProductVariants, useUpdateProduct, Variant } from '../products.hooks'
import Feedback from 'react-bootstrap/esm/Feedback'
import "react-color-palette/css";
import { ValidationError } from 'yup'
import useToggle from '@/hooks/useToggle'
import useModal from '@/hooks/useModal'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

interface FormValue {
  arName: string;
  enName: string;
  stock: number;
  price: number;
  salesPrice: number;
  maxQuantity: number;
  sku: string;
  color: string
}

type ValidationErrorType = {
  name?: string
  message: string
}

type ProductColor = {
  name: {
    ar: string;
    en: string;
  };
  value: string;
}

const ProductDetail = () => {

  const navigate = useNavigate()

  const updateProductColorRef = useRef<HTMLFormElement | null>(null);


  const updateProduct = useUpdateProduct()



  const { isOpen, className, toggleModal, openModalWithClass } = useModal()
  const { isTrue: isModelOpenUpdateProductColorForm, toggle: toggleModelUpdateProductColorForm } = useToggle()



  const [color, setColor] = useState<ProductColor>({
    name: {
      "ar": "",
      "en": ""
    },
    value: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const [validated, setValidated] = useState(false)

  const [isUpdatingProductColor, setIsUpdatingProductColor] = useState(false)

  const { productId } = useParams()


  const [formValue, setFormValue] = useState<FormValue>({
    arName: '',
    enName: '',
    stock: 0,
    price: 0,
    color: '',
    salesPrice: 0,
    maxQuantity: 4,
    sku: ''
  })

  const [formErrors, setFormErrors] = useState<ValidationErrorType[]>([])

  const { data: product, isError, isLoading } = useGetProduct(productId || "")
  const { data: productVariants, isLoading: isProductVariantsLoading, isError: isProductVariantsError } = useGetProductVariants(productId || "")



  const [variantImages, setVariantImages] = useState<File[] | []>([]);


  useEffect(() => {
    ; (async () => {
      // if (invoiceId) {
      //   const data = await getInvoiceById(invoiceId)
      //   if (data) setInvoice(data)
      //   else navigate('/pages/error-404-alt')
      // }
    })()
  }, [])




  const resetForm = () => {
    updateProductColorRef.current?.reset();
    setFormValue({
      arName: '',
      enName: '',
      stock: 0,
      price: 0,
      color: '',
      salesPrice: 0,
      maxQuantity: 4,
      sku: ''
    });
    setValidated(false);
    setVariantImages([]);
    setIsUpdatingProductColor(false);
    toggleModelUpdateProductColorForm()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value })
  }


  const handleUpdateProductColorSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setValidated(true)



    const validationReply = (await serverSideFormValidate(formValue)) as ValidationError
    const allErrors: ValidationErrorType[] = []
    validationReply?.inner?.forEach((e) => {
      allErrors.push({
        name: e.path,
        message: e.message,
      })
    });
    setFormErrors(allErrors);


    setIsUpdatingProductColor(true)

    // Get form values using FormData
    const formData = new FormData(event.target as HTMLFormElement);
    const arName = formData.get('arName') as string;
    const enName = formData.get('enName') as string;
    const colorValue = formData.get('colorValue') as string;


    const productColor: ProductColor = {
      name: {
        ar: arName,
        en: enName,
      },
      value: colorValue,
    }


    updateProduct.mutate({
      id: productId || "", product: {
        color: productColor
      }
    }, {
      onSuccess: (_res) => {
        resetForm();
      },
      onError: (error) => {
        setIsUpdatingProductColor(false);
        setErrorMessage(error?.response?.data.message)
        openModalWithClass('bg-danger')
      }
    })




    //   addVariant.mutate({ productId: product?.id || '', variant: newVariant }, {
    //     onSuccess: (_res) => {
    //       resetForm();
    //     }, onError: (error) => {
    //       //console.log("error", error)
    //       // console.error('Error adding variant:', error?.response?.data.message);
    //       setIsAddingVariant(false)
    //       setErrorMessage(error?.response?.data.message)
    //       openModalWithClass('bg-danger')
    //       //console.log("error", navigate)
    //       //setServerError(error.message || "Unknown error")
    //     }
    //   });
    // } else {
    //   setIsAddingVariant(false)
    //   setErrorMessage("برجاء اختار صورة علي الاقل")
    //   openModalWithClass('bg-secondary')
    // }
  }

  // const handleOnDeleteVariant = (productId: string, variantId: string) => {
  //   deleteVariant.mutate({ productId, variantId }, {
  //     onSuccess: (v) => {
  //       setVariantDelete(undefined)
  //     },
  //     onError: (v) => {

  //     },
  //   });
  // }


  const handleUpdateProduct = (productId: string, params: any) => {
    updateProduct.mutate({ id: productId, product: params }, {
      onSuccess: () => { },
      onError: () => { }
    })
  }

  return (
    <>
      <PageMetaData title={product?.id ?? 'تفاصيل المنتج'} />


      <Row>
        <Col xs={12}>
          {product && !isError && !isLoading && (
            <Card>
              <CardBody>
                <Row>

                  <Col xs={12}>


                    <img src={product.productCardImage} alt="image" className="img-fluid img-thumbnail" width={200} />

                    <Button variant="secondary" type="button" onClick={() => navigate(`/products/${product.id || product._id}/edit`)}>
                      تعديل النتج
                    </Button>


                    <div className="table-responsive table-borderless text-nowrap mt-3 table-centered">
                      {/* <ComponentContainerCard id="variant" title="Variants" description={<>Use contextual classes to color tables, table rows or individual cells.</>}> */}
                      <PageMetaData title="Basic Tables" />


                      {/* <Placeholder className="w-75" /> 
                        <Placeholder style={{ width: '25%' }} /> */}



                      <div className="table-responsive">
                        <table className="table">

                          <tbody>

                            <tr>
                              <td><strong>إسم المنتج بالعربي</strong></td>
                              <td>{product.name.ar}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>
                                  إسم المنتج بالنجليزية
                                </strong>
                              </td>
                              <td>{product.name.en}</td>
                            </tr>
                            <tr>
                              <td><strong>وصف المنتج بالعربية</strong></td>
                              <td>{product.description.ar}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>
                                  وصف المنتج بالإنجليزية
                                </strong>
                              </td>
                              <td>{product.description.en}</td>
                            </tr>
                            <tr>
                              <td><strong>مكونات المنتج بالعربية</strong></td>
                              <td>{product.components.ar}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>
                                  مكونات المنتج بالإنجليزية
                                </strong>
                              </td>
                              <td>{product.components.en}</td>
                            </tr>
                            <tr>
                              <td><strong>الماركة</strong></td>
                              <td>{product.name.ar}</td>
                            </tr>
                            <tr>
                              <td><strong>القسم</strong></td>
                              <td>{product.group.category?.department.name.ar}</td>
                            </tr>
                            <tr>
                              <td><strong>الفئة</strong></td>
                              <td>{product.group.category?.name.ar}</td>
                            </tr>
                            <tr>
                              <td><strong>المجموعة</strong></td>
                              <td>{product.group?.name.ar}</td>
                            </tr>
                            <tr>
                              <td><strong>السعر قبل الخصم</strong></td>
                              <td>{product.price}</td>
                            </tr>
                            <tr>
                              <td><strong>السعر بعد الخصم</strong></td>
                              <td>{product.salesPrice}</td>
                            </tr>
                            <tr>
                              <td><strong>المخزون</strong></td>
                              <td>{product.stock}</td>
                            </tr>
                            <tr>
                              <td><strong>رمز التخزين</strong></td>
                              <td>{product.sku}</td>
                            </tr>
                            <tr>
                              <td><strong>اقصي عدد للطلب</strong></td>
                              <td>{product.maxQuantity}</td>
                            </tr>


                            <tr>
                              <td><strong>حالة المنتج</strong></td>
                              <td>
                                {product.isOutOfStock ? 'غير متاج' : 'متاح'}
                              </td>
                            </tr>







                            <tr>
                              <td><strong>حالة المنتج</strong></td>
                              <td>
                                {/* غير ظاهر
                                <IconifyIcon icon="bxs:circle" className="font-13 text-danger me-2" /> */}
                                &nbsp;
                                <button type="button" onClick={() => handleUpdateProduct(product.id, { isPublished: !product.isPublished })} className={`btn ${product.isPublished ? "btn-danger" : "btn-success"}`}>{product.isPublished ? "إخفاء المنتج" : "إظهار المنتج"} </button>
                                &nbsp;
                                <button type="button" onClick={() => handleUpdateProduct(product.id, { isFeatured: !product.isFeatured })} className={`btn ${product.isFeatured ? "btn-danger" : "btn-success"}`}>{product.isFeatured ? "منتج غير مميز" : "منتج مميز"}</button>
                                {/* &nbsp;
                                <button type="button" className="btn btn-success">on sale</button> */}
                              </td>

                            </tr>
                            <tr>
                              <td><strong>لون المنتج</strong></td>
                              <td>

                                <Button type="button" variant="primary" onClick={toggleModelUpdateProductColorForm}>
                                  {product.color ? "تعديل لون المنتج" : "إضافة لون للمنتج"}
                                </Button>

                                <div style={{ width: "30px", height: "30px", backgroundColor: product?.color?.value }}></div>
                              </td>
                            </tr>

                          </tbody>
                        </table>
                      </div>




                      {/* </ComponentContainerCard> */}
                    </div>
                  </Col>
                </Row>

                <ComponentContainerCard
                  id="responsive"
                  title="ألوان المنتج"
                  description={
                    <>المنتجات المرتبطة بالمنتج ولها ألوان</>
                  }>
                  <Row>

                    <div className="table-responsive">
                      <table className="table">

                        <tbody>

                          {
                            productVariants && productVariants.length > 1 ? productVariants.map((variant: Product) => {
                              return (
                                <tr key={variant.id}>

                                  <td>
                                    {variant?.color?.name.ar}
                                    <strong> (المنتج الأم)</strong>
                                  </td>
                                  <td>
                                    <div style={{ width: "30px", height: "30px", backgroundColor: variant?.color?.value }}></div>
                                  </td>

                                  <td>
                                    {
                                      variant.id !== productId && <Button variant="primary" onClick={() => {
                                        navigate(`/products/${variant.id}`)
                                        // handleOnDeleteVariant(product.id, variant.id || "")
                                        // setVariantDelete(variant)
                                      }}>
                                        تفاصيل
                                      </Button>
                                    }
                                  </td>
                                </tr>
                              )
                            })
                              : <tr>لا يوجد ألوان لهذا المنتج</tr>
                          }


                        </tbody>
                      </table>
                    </div>
                  </Row>
                </ComponentContainerCard>


                <ComponentContainerCard
                  id="responsive"
                  title="معرض الصور"
                  description={
                    <>صور خاص بالمنتج الاصلي</>
                  }>
                  <Row>
                    {

                      product.images && product.images.length && product.images.map((image, index) => {
                        return <Col xs={3} key={image.public_id}>
                          <img src={image.url} alt="image" className="img-fluid img-thumbnail" width={200} />
                        </Col>

                      })
                    }
                  </Row>
                </ComponentContainerCard>

                {/* <ColorPicker  color={color} onChange={setColor} /> */}



              </CardBody>

            </Card>
          )}




          <Modal className="fade" show={isOpen} onHide={toggleModal} size="sm">
            <div className={`modal-filled rounded-2 ${className}`}>
              <ModalBody>
                <div className="text-center">
                  <IconifyIcon icon="bx:error" className="display-6 mt-0 text-white" />
                  <h4 className="mt-3 text-white">! عفوا</h4>
                  <p className="mt-3">{errorMessage}</p>
                  <Button variant="light" type="button" className="mt-3" onClick={toggleModal}>
                    تمام
                  </Button>
                </div>
              </ModalBody>
            </div>
          </Modal>




          <Modal show={isModelOpenUpdateProductColorForm} className="fade" scrollable id="exampleModalScrollable" tabIndex={-1}>
            <ModalHeader>
              <h5 className="modal-title" id="exampleModalScrollableTitle">
                إضافة لون لهذا المنتج
              </h5>
              {/* <button type="button" className="btn-close" onClick={toggleModelAddVariantForm} /> */}
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col xs={12}>
                  <Form ref={updateProductColorRef} className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleUpdateProductColorSubmit}>
                    <div className="mb-3" />
                    <Row>
                      <Col lg={6} xs={12}>
                        <FormGroup>
                          <FormLabel>الإسم العربي</FormLabel>
                          <FormControl type="text" id="validationCustom01" name='arName' placeholder="الإسم بالعربي" defaultValue={product && product.color?.name?.ar || ""} required onChange={handleChange} />
                          <Feedback>صحيح</Feedback>
                          <Feedback type="invalid">
                            برجاء ادخال الاسم باللغة العربية
                          </Feedback>
                        </FormGroup>
                      </Col>
                      <Col lg={6} xs={12}>
                        <FormGroup >
                          <FormLabel>الإسم بالإنجليزية</FormLabel>
                          <FormControl type="text" id="validationCustom02" name='enName' placeholder="الإسم بالإنجليزية" defaultValue={product && product.color?.name?.en || ""} required onChange={handleChange} />
                          <Feedback>صحيح</Feedback>
                          <Feedback type="invalid">
                            برجاء ادخال الاسم باللغة الإنجليزية
                          </Feedback>
                        </FormGroup>
                      </Col>

                    </Row>
                    <Row>
                      <Col lg={12} xs={12}>
                        <FormGroup>
                          <FormLabel>اللون</FormLabel>
                          <FormControl type="text" id="validationCustom01" name='colorValue' placeholder="كود اللون" defaultValue={product && product.color?.value || ""} required onChange={handleChange} />
                          <Feedback>صحيح</Feedback>
                          <Feedback type="invalid">
                            برجاء ادخال كود اللون
                          </Feedback>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" type="button" onClick={() => {
                toggleModelUpdateProductColorForm();
                resetForm()
              }}>
                غلق
              </Button>
              <Button variant="primary" style={{ backgroundColor: 'green' }} type="submit" disabled={isUpdatingProductColor} onClick={() => {
                updateProductColorRef.current?.requestSubmit()
              }}>
                حفظ
              </Button>
            </ModalFooter>
          </Modal>

        </Col>
      </Row>
    </>
  )
}

export default ProductDetail
