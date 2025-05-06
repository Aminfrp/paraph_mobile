export type ProductInvoice = {
  id: number;
  version: number;
  timelineId: number;
  entityId: number;
  forwardedId: number;
  numOfLikes: number;
  numOfDisLikes: number;
  numOfShare: number;
  numOfFavorites: number;
  numOfComments: number;
  timestamp: number;
  enable: boolean;
  hide: boolean;
  replyPostConfirmation: boolean;
  business: Business;
  userSrv: UserSrv;
  rate: Rate;
  userPostInfo: UserPostInfo;
  metadata: Metadata;
  lgContent: string;
  latitude: number;
  longitude: number;
  uniqueId: string;
  canComment: boolean;
  canLike: boolean;
  canRate: boolean;
  tags: string[];
  tagTrees: Guild[];
  repliedItemSrv: ParentProduct;
  attributeValues: AttributeValue[];
  templateCode: string;
  name: string;
  description: string;
  categoryList: string[];
  preview: string;
  unlimited: boolean;
  availableCount: number;
  price: number;
  discount: number;
  saleInfo: SaleInfo;
  guild: Guild;
  allowUserInvoice: boolean;
  allowUserPrice: boolean;
  subProducts: SubProduct[];
  productGroup: ProductGroup;
  content: string;
  currency: Currency;
  parentProduct: ParentProduct;
  relatedProductsId: number[];
  preferredTaxRate: number;
};

type AttributeValue = {
  code: string;
  name: string;
  value: string;
};

type Business = {
  id: number;
  name: string;
  image: string;
  numOfProducts: number;
  rate: Rate;
  sheba: number;
  ssoId: number;
  serviceCallName: string;
  phone: string;
};

type Rate = {
  rate: number;
  rateCount: number;
};

type Currency = {
  name: string;
  code: string;
};

type Guild = {
  id: number;
  name: string;
  code: string;
};

type Metadata = {
  product_type_id: string;
  seo: SEO;
  businessId: string;
  content_related: TRelated[];
  product_related: TRelated[];
  contentRelatedQuery: TRelatedQuery[];
  productRelatedQuery: TRelatedQuery[];
  created: Created;
  updated: Editable;
  editable: Editable;
  published: Editable;
  product: Product[];
  product_type_name: string;
  product_type_description: string;
};

type TRelatedQuery = {
  uniqueId: string;
  query: string;
};

type TRelated = {
  uniqueId: string;
  name: string;
  values: string[];
};

type Created = {
  at: number;
  user_name: string;
  ssoId: number;
};

type Editable = {
  status?: boolean;
  at: number;
  user_name: string;
  ssoId: string;
};

type Product = {
  code: string;
  name: string;
  primary: boolean;
  order: number;
  type: string;
  uiType: string;
  value: number;
  icon: string;
  iconType: string;
  common: boolean;
  valueTitles: string;
  group: string;
  templateFieldCode: string;
};

type SEO = {
  keyword: string[];
  description: string;
};

type ParentProduct = {};

type ProductGroup = {
  id: number;
  sharedAttributeCodes: string[];
};

type SaleInfo = {
  id: number;
  discountPercent: number;
  startDate: number;
  endDate: number;
  type: string;
};

type SubProduct = {
  id: number;
  previewInfo: string;
  availableCount: number;
  discount: number;
  attributeValues: AttributeValue[];
};

type UserPostInfo = {
  postId: number;
  liked: number;
  disliked: boolean;
  favorite: boolean;
};

type UserSrv = {
  id: number;
  name: string;
  ssoId: number;
  ssoIssuerCode: number;
  profileImage: string;
};
