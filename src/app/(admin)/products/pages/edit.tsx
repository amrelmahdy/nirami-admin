import PageMetaData from '@/components/PageTitle'
import { ChangeEvent, FormEvent, useState } from 'react'
import { serverSideFormValidate } from '@/helpers/data'
import { ValidationError } from 'yup'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Button, Col, Row, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Alert, Spinner } from 'react-bootstrap'
import Feedback from 'react-bootstrap/esm/Feedback'
import { useNavigate, useParams } from 'react-router-dom'
import DropzoneFormInput from '@/components/form/DropzoneFormInput'
import { deleteCloudImage, uploadCloudImages } from '@/helpers/services'
import { Group, useGetGroups } from '../../groups/groups.hooks'
import { Department, useGetDepartments } from '../../departments/departments.hooks'
import { Category, useGetCategories } from '../../categories/categories.hooks'
import { Brand, useGetBrands } from '../../brands/brands.hooks'
import { Product, useAddProduct, useGetProduct, useGetProducts, useUpdateProduct } from '../products.hooks'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

type ValidationErrorType = {
    name?: string
    message: string
}


interface FormValue {
    arName: string;
    enName: string;
    arDescription: string;
    enDescription: string;
    arComponents: string;
    enComponents: string;
    brand: string;
    department: string;
    category: string;
    group: string;
    stock: number;
    price: number;
    salesPrice: number;
    maxQuantity: number;
    sku: string;
}

interface FormValue {
    arName: string;
    enName: string;
    arDescription: string;
    enDescription: string;
    arComponents: string;
    enComponents: string;
    brand: string;
    department: string;
    category: string;
    group: string;
    stock: number;
    price: number;
    salesPrice: number;
    maxQuantity: number;
    sku: string;
    parentProduct: string | null;
}

const validateForm = (form: FormValue): { isValid: boolean; errors: Partial<Record<keyof FormValue, string>> } => {
    const errors: Partial<Record<keyof FormValue, string>> = {};

    const requiredFields: (keyof FormValue)[] = [
        'arName', 'enName', 'arDescription', 'enDescription',
        'arComponents', 'enComponents', 'brand', 'department',
        'category', 'group', 'sku'
    ];

    requiredFields.forEach(field => {
        if (!form[field] || (typeof form[field] === 'string' && form[field].trim() === '')) {
            errors[field] = 'This field is required.';
        }
    });

    if (form.stock < 0) errors.stock = 'Stock cannot be negative.';
    if (form.price < 0) errors.price = 'Price cannot be negative.';
    if (form.salesPrice < 0) errors.salesPrice = 'Sales price cannot be negative.';
    if (form.maxQuantity < 1) errors.maxQuantity = 'Max quantity must be at least 1.';

    const isValid = Object.keys(errors).length === 0;
    return { isValid, errors };
};


const EditProduct = () => {



    const navigate = useNavigate();



    const updateProduct = useUpdateProduct();
    const [formValue, setFormValue] = useState<FormValue>({
        arName: '',
        enName: '',
        arDescription: '',
        enDescription: '',
        arComponents: '',
        enComponents: '',
        brand: '',
        department: '',
        category: '',
        group: '',
        stock: 0,
        price: 0,
        salesPrice: 0,
        maxQuantity: 4,
        sku: '',
        parentProduct: null
    })


    const [isLoading, setIsLoading] = useState(false);


    const [serverError, setServerError] = useState("");

    const [validated, setValidated] = useState(false)
    const [formErrors, setFormErrors] = useState<ValidationErrorType[]>([])

    const [productImage, setProductImage] = useState<File | undefined>(undefined);
    const [productImages, setProductImages] = useState<File[] | []>([]);

    const { productId } = useParams()


    const { data: productsList, isError: isProductsListError, isLoading: isProductsListLoading } = useGetProducts({ onlyParents: true });
    const { data: product, isError: isProductError, isLoading: isProductLoading } = useGetProduct(productId || "")
    const { data: departmentsList, isError: isDepartmentsError, isLoading: isDepartmentsLoading } = useGetDepartments();
    const { data: categoriesList, isError: isCategoriesError, isLoading: isCategoriesLoading } = useGetCategories({ departmentId: formValue.department });
    const { data: groupsList, isError: isGroupsError, isLoading: isGroupsLoading } = useGetGroups({ categoryId: formValue.category });
    const { data: brandsList, isError: isBrandsError, isLoading: isBrandsLoading } = useGetBrands();



    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value })
    }


    console.log(validateForm(formValue))


    console.log("productsListproductsListproductsListproductsListproductsList", productsList)


    const isValidInput = (name: string) => {
        return !formErrors.find((key) => key.name === name)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

        setIsLoading(true);

        const newProduct: any = {
            name: {
                ar: formValue.arName !== "" ? formValue.arName : product?.name.ar,
                en: formValue.enName !== "" ? formValue.enName : product?.name.en
            },
            description: {
                en: formValue.enDescription !== "" ? formValue.enDescription : product?.description.en,
                ar: formValue.arDescription !== "" ? formValue.arDescription : product?.description.ar
            },
            components: {
                en: formValue.enComponents !== "" ? formValue.enComponents : product?.components.en,
                ar: formValue.arComponents !== "" ? formValue.arComponents : product?.components.ar
            },
            //sku: formValue.sku !== "" ? formValue.sku : product?.sku,
            price: formValue.price !== 0 ? parseFloat(formValue.price) : product?.price,
            salesPrice: formValue.salesPrice !== 0 ? parseFloat(formValue.salesPrice) : product?.salesPrice,
            brand: formValue.brand !== "" ? formValue.brand : product?.brand?.id,
            group: formValue.group !== "" ? formValue.group : product?.group?.id,
            stock: formValue.stock !== 0 ? parseInt(formValue.stock) : product?.stock,
            maxQuantity: formValue.stock !== 0 ? parseInt(formValue.maxQuantity) : product?.maxQuantity,
            //parentProduct: formValue.parentProduct ? formValue.parentProduct : null,
        }




        if (productImage) {
            console.log("Image card : productImage", productImage)
            const uploadedImages = await uploadCloudImages([productImage], `products`);
            newProduct.productCardImage = uploadedImages[0].url;
        }

        if (productImages.length > 0) {
            console.log("Image card : productImages", productImages)
            const uploadedImages = await uploadCloudImages(productImages, `products`);
            newProduct.images = [...product?.images, ...uploadedImages];
        }


        updateProduct.mutate({
            id: productId || "",
            product: newProduct

        }, {
            onSuccess: (product) => {
                  setIsLoading(false);
                navigate(`/products/${product.id}`)
                // Optionally, you can update the state or refetch the product details here
            }, onError: (error) => {
                setServerError(error.message || "Unknown error")
            }
        })
    }



    return (
        <>
            <PageMetaData title="إضافة قسم" />

            <Row>
                <Col xl={7}>
                    {
                        serverError !== "" && <Alert variant="danger" role="alert">
                            {serverError}
                        </Alert>
                    }
                    <ComponentContainerCard
                        id="custom-styles"
                        title={product ? `تعديل ${product.name.ar}` : "تعديل منتج"}
                        description={
                            <>

                            </>
                        }>



                        <Form className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>



                            {!formValue.parentProduct &&

                                <>
                                    <Row>
                                        <Col xs={6}>
                                            <FormGroup >
                                                <FormLabel>الإسم العربي</FormLabel>
                                                <FormControl type="text" id="validationCustom01" name='arName' placeholder="الإسم بالعربي" defaultValue={product?.name?.ar || ""} required onChange={handleChange} />
                                                <Feedback>صحيح</Feedback>
                                                <Feedback type="invalid">
                                                    برجاء ادخال الاسم باللغة العربية
                                                </Feedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs={6}>
                                            <FormGroup >
                                                <FormLabel>الإسم بالإنجليزية</FormLabel>
                                                <FormControl type="text" id="validationCustom02" name='enName' placeholder="الإسم بالإنجليزية" defaultValue={product?.name?.en || ""} required onChange={handleChange} />
                                                <Feedback>صحيح</Feedback>
                                                <Feedback type="invalid">
                                                    برجاء ادخال الاسم باللغة الإنجليزية
                                                </Feedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>



                                    <div className="mb-3" />

                                    <Row>
                                        <Col xs={6}>
                                            <FormGroup >
                                                <FormLabel>الوصف العربي</FormLabel>
                                                <FormControl as="textarea" rows={3} id="validationCustom01" name='arDescription' placeholder="الوصف بالعربي" defaultValue={product?.description?.ar || ""} required onChange={handleChange} />
                                                <Feedback>صحيح</Feedback>
                                                <Feedback type="invalid">
                                                    برجاء ادخال الوصف باللغة العربية
                                                </Feedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs={6}>
                                            <FormGroup >
                                                <FormLabel>الوصف بالإنجليزية</FormLabel>
                                                <FormControl as="textarea" rows={3} id="validationCustom02" name='enDescription' placeholder="الوصف بالإنجليزية" defaultValue={product?.description?.en || ""} required onChange={handleChange} />
                                                <Feedback>صحيح</Feedback>
                                                <Feedback type="invalid">
                                                    برجاء ادخال الوصف باللغة الإنجليزية
                                                </Feedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <div className="mb-3" />


                                    <Row>
                                        <Col xs={6}>
                                            <FormGroup >
                                                <FormLabel>المكونات العربي</FormLabel>
                                                <FormControl as="textarea" rows={3} id="validationCustom01" name='arComponents' placeholder="المكونات بالعربي" defaultValue={product?.components?.ar || ""} required onChange={handleChange} />
                                                <Feedback>صحيح</Feedback>
                                                <Feedback type="invalid">
                                                    برجاء ادخال المكونات باللغة العربية
                                                </Feedback>
                                            </FormGroup>
                                        </Col>
                                        <Col xs={6}>
                                            <FormGroup >
                                                <FormLabel>المكونات بالإنجليزية</FormLabel>
                                                <FormControl as="textarea" rows={3} id="validationCustom02" name='enComponents' placeholder="المكونات بالإنجليزية" defaultValue={product?.components?.en || ""} required onChange={handleChange} />
                                                <Feedback>صحيح</Feedback>
                                                <Feedback type="invalid">
                                                    برجاء ادخال المكونات باللغة الإنجليزية
                                                </Feedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <div className="mb-3" />
                                </>
                            }

                            <Row>
                                <Col xs={12}>


                                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                        <img src={product?.productCardImage} alt="image" className="img-fluid img-thumbnail" width={200} />

                                    </div>


                                    <DropzoneFormInput
                                        iconProps={{ icon: 'bx:cloud-upload', height: 36, width: 36 }}
                                        text="قم بإسقاط صورة المنتج هنا أو انقر للتحميل."
                                        helpText={
                                            <span className="text-muted fs-13">
                                                الامتدادات المقبولة فقط هي .png، .jpeg، .jpg.
                                            </span>
                                        }
                                        maxFiles={1}
                                        showPreview
                                        onFileUpload={async (files) => {
                                            setProductImage(files[0])
                                        }}
                                        onRemoveFile={(_index) => {
                                            //departmentImage?.splice(index, 1)
                                            setProductImage(undefined)
                                        }}
                                    />



                                    {!formValue.parentProduct && <>
                                        <div className="mb-3" />

                                        <FormGroup >
                                            <FormLabel>الماركة</FormLabel>
                                            <Form.Select required onChange={(e) => {
                                                setFormValue({ ...formValue, brand: e.target.value as string })
                                            }} aria-label="Default select example">
                                                <option value="">اختار الماركة</option>
                                                {brandsList?.map((brand: Brand, idx) => (
                                                    <option key={idx} selected={product?.brand?.id === brand.id} value={brand.id}>
                                                        {brand.name.ar}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FormGroup>

                                        <div className="mb-3" />



                                        {!isDepartmentsError && !isDepartmentsLoading && <FormGroup >
                                            <FormLabel>القسم</FormLabel>
                                            <Form.Select required onChange={(e) => {
                                                setFormValue({ ...formValue, department: e.target.value as string })
                                            }} aria-label="Default select example">
                                                <option value="">اختار القسم</option>
                                                {departmentsList?.map((department: Department, idx) => (
                                                    <option key={idx} selected={product?.group?.category?.department.id === department.id} value={department.id}>
                                                        {department.name.ar}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FormGroup>}

                                        <div className="mb-3" />


                                        {!isCategoriesError && !isCategoriesLoading && <FormGroup >
                                            <FormLabel>الفئة</FormLabel>
                                            <Form.Select disabled={formValue.department === ""} required onChange={(e) => {
                                                setFormValue({ ...formValue, category: e.target.value as string })
                                            }} aria-label="Default select example">
                                                <option value="">اختار الفئة</option>
                                                {categoriesList?.map((category: Category, idx) => (
                                                    <option key={idx} selected={product?.group?.category?.id === category.id} value={category.id}>
                                                        {category.name.ar}
                                                        &nbsp;
                                                        ({category.department.name.ar})
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FormGroup>}

                                        <div className="mb-3" />

                                        {!isGroupsError && !isGroupsLoading && <FormGroup >
                                            <FormLabel>المجموعة</FormLabel>
                                            <Form.Select disabled={formValue.category === ""} required onChange={(e) => {
                                                setFormValue({ ...formValue, group: e.target.value as string })
                                            }} aria-label="Default select example">
                                                <option value="">اختار المجموعة</option>
                                                {groupsList?.map((group: Group, idx) => (
                                                    <option key={idx} selected={product?.group?.id === group.id} value={group.id}>
                                                        {group.name.ar}
                                                        &nbsp;
                                                        ({group.category.name.ar})
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FormGroup>}

                                        <div className="mb-3" />
                                    </>}

                                    <FormGroup >
                                        <FormLabel>السعر قبل الخصم</FormLabel>
                                        <FormControl type="number" id="validationCustom01" name='price' placeholder="برجاء ادخال السعر" defaultValue={product?.price} required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال السعر بالريال
                                        </Feedback>
                                    </FormGroup>


                                    <div className="mb-3" />


                                    <FormGroup >
                                        <FormLabel>السعر بعد الخصم</FormLabel>
                                        <FormControl type="number" id="validationCustom01" name='salesPrice' placeholder="برجاء ادخال سعر العرض" defaultValue={product?.salesPrice} required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال سعر العرض بالريال
                                        </Feedback>
                                    </FormGroup>


                                    <div className="mb-3" />

                                    <FormGroup >
                                        <FormLabel>المخزون</FormLabel>
                                        <FormControl type="number" id="validationCustom01" name='stock' placeholder="برجاء ادخال كمية المخزون" defaultValue={product?.stock} required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال كمية المخزون
                                        </Feedback>
                                    </FormGroup>





                                    <div className="mb-3" />

                                    <FormGroup >
                                        <FormLabel>رمز التخزين</FormLabel>
                                        <FormControl disabled type="text" id="validationCustom01" name='sku' placeholder="برجاء ادخال رمز التخزين" defaultValue={product?.sku} required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء ادخال كمية المخزون
                                        </Feedback>
                                    </FormGroup>


                                    <div className="mb-3" />

                                    <FormGroup >
                                        <FormLabel>اقصي عدد للطلب</FormLabel>
                                        <FormControl type="number" id="validationCustom01" name='maxQuantity' placeholder="برجاء ادخال اقصي عدد للطلب" defaultValue={product?.maxQuantity} required onChange={handleChange} />
                                        <Feedback>صحيح</Feedback>
                                        <Feedback type="invalid">
                                            برجاء اقصي عدد للطلب
                                        </Feedback>
                                    </FormGroup>

                                    <div className="mb-3" />


                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        {

                                            !isProductLoading && !isProductError && product?.images && product.images.length && product.images.map((image, index) => {
                                                return <div key={image.public_id}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Button variant="danger" className="btn-icon btn-icon-only" onClick={() => {

                                                            deleteCloudImage(image.public_id).then(() => {
                                                                product.images.splice(index, 1);
                                                                updateProduct.mutate({
                                                                    id: productId || "",
                                                                    product: {
                                                                        images: product.images
                                                                    }

                                                                }, {
                                                                    onSuccess: (product) => {
                                                                        console.log("Product updated successfully", product);
                                                                        // Optionally, you can update the state or refetch the product details here
                                                                    }, onError: (error) => {
                                                                        setServerError(error.message || "Unknown error")
                                                                    }
                                                                })
                                                                //  


                                                                //console.log("product.images", product.images) 

                                                                //setProductImages([...product.images]);
                                                            })
                                                        }}>
                                                            <IconifyIcon icon="mdi:delete" width={20} height={20} />
                                                        </Button>
                                                    </div>
                                                    <img src={image.url} alt="image" className="img-fluid img-thumbnail" width={200} />
                                                </div>

                                            })
                                        }
                                    </div>


                                    <DropzoneFormInput
                                        iconProps={{ icon: 'bx:cloud-upload', height: 36, width: 36 }}
                                        text="قم بإسقاط الصور الخاصة بالمنتج هنا أو انقر للتحميل."
                                        helpText={
                                            <span className="text-muted fs-13">
                                                الامتدادات المقبولة فقط هي .png، .jpeg، .jpg.
                                            </span>
                                        }
                                        maxFiles={4}
                                        showPreview
                                        onFileUpload={async (files) => {
                                            setProductImages(files)
                                        }}
                                        onRemoveFile={(index) => {
                                            productImages?.splice(index, 1)
                                            setProductImages(productImages)
                                        }}
                                    />

                                    <div className="mb-3" />


                                </Col>

                            </Row>

                            <Col xs={12}>


                                <Button variant="primary" className="width-xl" type="submit">
                                   {isLoading &&  <Spinner color="white" className="spinner-border-sm me-1" />}
                                    حفظ
                                </Button>
                            </Col>
                        </Form>
                    </ComponentContainerCard>
                </Col>
            </Row>
        </>
    )
}

export default EditProduct

