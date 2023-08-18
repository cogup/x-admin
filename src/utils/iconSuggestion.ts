import { capitalizeFirstLetter } from './index';

export enum IconSuggestion {
  analytics = 'AreaChartOutlined',
  article = 'FileOutlined',
  audio = 'AudioOutlined',
  backups = 'CloudUploadOutlined',
  bookmarks = 'BookOutlined',
  calendar = 'CalendarOutlined',
  contacts = 'ContactsOutlined',
  create = 'PlusOutlined',
  createAnalytics = 'AreaChartOutlined',
  createFile = 'FileAddOutlined',
  createOrder = 'ShoppingCartOutlined',
  createProjects = 'FolderAddOutlined',
  createSettings = 'SettingOutlined',
  createTag = 'PlusOutlined',
  createUsers = 'UserAddOutlined',
  currency = 'DollarOutlined',
  dashboard = 'DashboardOutlined',
  delete = 'DeleteOutlined',
  deleteAnalytics = 'AreaChartOutlined',
  deleteBookmarks = 'BookDeleteOutlined',
  deleteCalendar = 'CalendarDeleteOutlined',
  deleteContacts = 'ContactsDeleteOutlined',
  deleteDocuments = 'FileTextDeleteOutlined',
  deleteGroup = 'TeamDeleteOutlined',
  deleteLocation = 'EnvironmentDeleteOutlined',
  deleteLog = 'ProfileDeleteOutlined',
  deleteMarketing = 'MailDeleteOutlined',
  deleteMessages = 'MessageDeleteOutlined',
  deleteNotifications = 'NotificationDeleteOutlined',
  deleteOrder = 'ShoppingCartOutlined',
  deletePayments = 'CreditCardDeleteOutlined',
  deletePermission = 'KeyDeleteOutlined',
  deleteProjects = 'ProjectDeleteOutlined',
  deleteReports = 'BarChartDeleteOutlined',
  deleteSearch = 'SearchDeleteOutlined',
  deleteSettings = 'SettingOutlined',
  deleteStock = 'DatabaseDeleteOutlined',
  documents = 'FileTextOutlined',
  download = 'DownloadOutlined',
  edit = 'EditOutlined',
  editAnalytics = 'AreaChartOutlined',
  editArticle = 'FileOutlined',
  editAudio = 'AudioOutlined',
  editBackups = 'CloudUploadOutlined',
  editBookmarks = 'BookOutlined',
  editCalendar = 'CalendarOutlined',
  editContacts = 'ContactsOutlined',
  editDocuments = 'FileTextOutlined',
  editFile = 'FileOutlined',
  editGroup = 'TeamOutlined',
  editHelp = 'CustomerServiceOutlined',
  editImages = 'PictureOutlined',
  editInvoices = 'FileDoneOutlined',
  editLocation = 'EnvironmentOutlined',
  editLog = 'ProfileOutlined',
  editMarketing = 'MailOutlined',
  editMessages = 'MessageOutlined',
  editNotifications = 'NotificationOutlined',
  editOrder = 'ShoppingCartOutlined',
  editPayments = 'CreditCardOutlined',
  editPermission = 'KeyOutlined',
  editProducts = 'ShoppingOutlined',
  editProjects = 'ProjectOutlined',
  editReports = 'BarChartOutlined',
  editSearch = 'SearchOutlined',
  editSettings = 'SettingOutlined',
  editStock = 'DatabaseOutlined',
  editTag = 'TagOutlined',
  editTasks = 'ScheduleOutlined',
  editUser = 'UserOutlined',
  export = 'ExportOutlined',
  file = 'FileOutlined',
  group = 'TeamOutlined',
  help = 'CustomerServiceOutlined',
  images = 'PictureOutlined',
  import = 'ImportOutlined',
  invoices = 'FileDoneOutlined',
  language = 'GlobalOutlined',
  leader = 'CrownOutlined',
  list = 'UnorderedListOutlined',
  listAnalytics = 'AreaChartOutlined',
  listArticle = 'UnorderedListOutlined',
  listBookmarks = 'BookOutlined',
  listCalendar = 'CalendarOutlined',
  listContacts = 'ContactsOutlined',
  listDashboard = 'DashboardOutlined',
  listDocuments = 'FileTextOutlined',
  listFile = 'FileOutlined',
  listGroup = 'TeamOutlined',
  listHelp = 'CustomerServiceOutlined',
  listImages = 'PictureOutlined',
  listInvoices = 'FileDoneOutlined',
  listLocation = 'EnvironmentOutlined',
  listMarketing = 'MailOutlined',
  listNotifications = 'NotificationOutlined',
  listOrders = 'ShoppingCartOutlined',
  listPayments = 'CreditCardOutlined',
  listPermission = 'KeyOutlined',
  listProducts = 'ShoppingOutlined',
  listProjects = 'ProjectOutlined',
  listReports = 'BarChartOutlined',
  listSearch = 'SearchOutlined',
  listSettings = 'SettingOutlined',
  listStock = 'DatabaseOutlined',
  listTag = 'TagsOutlined',
  listTasks = 'ScheduleOutlined',
  location = 'EnvironmentOutlined',
  lock = 'LockOutlined',
  login = 'LoginOutlined',
  logout = 'LogoutOutlined',
  log = 'ProfileOutlined',
  marketing = 'MailOutlined',
  messages = 'MessageOutlined',
  notifications = 'NotificationOutlined',
  orders = 'ShoppingCartOutlined',
  payments = 'CreditCardOutlined',
  permission = 'KeyOutlined',
  profile = 'ProfileOutlined',
  projects = 'ProjectOutlined',
  read = 'EyeOutlined',
  readAnalytics = 'AreaChartOutlined',
  readArticle = 'FileOutlined',
  readAudio = 'AudioOutlined',
  readBackups = 'CloudUploadOutlined',
  readBookmarks = 'BookOutlined',
  readCalendar = 'CalendarOutlined',
  readContacts = 'ContactsOutlined',
  readDocuments = 'FileTextOutlined',
  readFile = 'FileOutlined',
  readGroup = 'TeamOutlined',
  readHelp = 'CustomerServiceOutlined',
  readImages = 'PictureOutlined',
  readInvoices = 'FileDoneOutlined',
  readLocation = 'EnvironmentOutlined',
  readLog = 'ProfileOutlined',
  readMarketing = 'MailOutlined',
  readMessages = 'MessageOutlined',
  readNotifications = 'NotificationOutlined',
  readOrder = 'ShoppingCartOutlined',
  readPermission = 'KeyOutlined',
  readProducts = 'ShoppingOutlined',
  readProjects = 'ProjectOutlined',
  readReports = 'BarChartOutlined',
  readSearch = 'SearchOutlined',
  readSettings = 'SettingOutlined',
  readStock = 'DatabaseOutlined',
  readTag = 'TagOutlined',
  readTasks = 'ScheduleOutlined',
  readUser = 'UserOutlined',
  reports = 'BarChartOutlined',
  search = 'SearchOutlined',
  settings = 'SettingOutlined',
  stock = 'DatabaseOutlined',
  sync = 'SyncOutlined',
  tag = 'TagOutlined',
  tasks = 'ScheduleOutlined',
  unlock = 'UnlockOutlined',
  upload = 'UploadOutlined',
  users = 'UserOutlined',
  video = 'VideoCameraOutlined',
  others = 'EllipsisOutlined',
  options = 'CheckSquareOutlined',
  id = 'IdcardOutlined',
  link = 'LinkOutlined',
  status = 'CheckCircleOutlined',
  date = 'ClockCircleOutlined',
  color = 'BgColorsOutlined',
  website = 'GlobalOutlined',
  repository = 'GithubOutlined',
  server = 'CloudServerOutlined',
  application = 'AppstoreOutlined',
  author = 'StarOutlined',
  email = 'MailOutlined'
}

function getDirectSuggestion(
  lowercaseResourceName: string,
  typeName: string
): IconSuggestion | null {
  const resourceNameCapitalized = capitalizeFirstLetter(lowercaseResourceName);
  const lowercaseTypename = typeName.toLowerCase();
  const completeName = `${lowercaseTypename}${resourceNameCapitalized}`;

  const iconSuggestion = getIconSuggestionFromString(completeName);

  return iconSuggestion ?? null;
}

function getSuggestionByType(
  lowercaseResourceName: string,
  typeName: string
): IconSuggestion | null {
  const lowercaseTypename = typeName.toLowerCase();
  const resourceSuggestion = getIconSuggestionInner(
    lowercaseResourceName
  ).toString();
  const resourceSuggestionCapitalized =
    capitalizeFirstLetter(resourceSuggestion);
  const completeNameNewResourceSuggestion = `${lowercaseTypename}${resourceSuggestionCapitalized}`;

  const newIconSuggestion = getIconSuggestionFromString(
    completeNameNewResourceSuggestion
  );

  return newIconSuggestion ?? null;
}

function getSuggestionDefaultByType(typeName: string): IconSuggestion | null {
  const altSuggestion = getIconSuggestionInner(typeName.toLowerCase());
  const altIconSuggestion = getIconSuggestionFromString(altSuggestion);

  return altIconSuggestion ?? null;
}

export function getIconSuggestion(
  resourceName: string,
  typeName?: string
): IconSuggestion {
  const lowercaseResourceName = resourceName.toLowerCase();

  if (typeName !== undefined) {
    const iconDirectSuggestion = getDirectSuggestion(
      lowercaseResourceName,
      typeName
    );

    if (iconDirectSuggestion !== null) {
      return iconDirectSuggestion;
    }

    const iconSuggestionByType = getSuggestionByType(
      lowercaseResourceName,
      typeName
    );

    if (iconSuggestionByType !== null) {
      return iconSuggestionByType;
    }

    const iconDirectSuggestionDefaultByType =
      getSuggestionDefaultByType(typeName);

    if (iconDirectSuggestionDefaultByType !== null) {
      return iconDirectSuggestionDefaultByType;
    }
  }

  const suggestion = getIconSuggestionInner(lowercaseResourceName);

  return getIconSuggestionFromString(suggestion) ?? IconSuggestion.others;
}

const enumKeys = Object.keys(IconSuggestion) as Array<
  keyof typeof IconSuggestion
>;

function getIconSuggestionFromString(str: string): IconSuggestion | undefined {
  const foundKey = enumKeys.find((key) => key === str);

  return foundKey !== undefined ? IconSuggestion[foundKey] : undefined;
}

function getIconSuggestionInner(lowercaseResourceName: string): string {
  if (
    ['post', 'blog', 'article', 'notice', 'news'].includes(
      lowercaseResourceName
    )
  ) {
    return 'article';
  }

  if (
    [
      'user',
      'users',
      'member',
      'members',
      'customer',
      'customers',
      'client',
      'clients',
      'employee',
      'employees',
      'staff',
      'staffs'
    ].includes(lowercaseResourceName)
  ) {
    return 'users';
  }

  if (
    ['order', 'orders', 'purchase', 'purchases'].includes(lowercaseResourceName)
  ) {
    return 'orders';
  }

  if (
    ['stock', 'stocks', 'inventory', 'inventories'].includes(
      lowercaseResourceName
    )
  ) {
    return 'stock';
  }

  if (
    ['analytics', 'statistic', 'statistics'].includes(lowercaseResourceName)
  ) {
    return 'analytics';
  }

  if (
    ['marketing', 'marketings', 'promotion', 'promotions'].includes(
      lowercaseResourceName
    )
  ) {
    return 'marketing';
  }

  if (
    [
      'setting',
      'settings',
      'config',
      'configs',
      'configuration',
      'configurations'
    ].includes(lowercaseResourceName)
  ) {
    return 'settings';
  }

  if (
    ['tag', 'tags', 'category', 'categories'].includes(lowercaseResourceName)
  ) {
    return 'tag';
  }

  if (['dashboard', 'home', 'main', 'index'].includes(lowercaseResourceName)) {
    return 'dashboard';
  }

  if (['create', 'add', 'new'].includes(lowercaseResourceName)) {
    return 'create';
  }

  if (['edit', 'modify', 'update'].includes(lowercaseResourceName)) {
    return 'edit';
  }

  if (['delete', 'remove'].includes(lowercaseResourceName)) {
    return 'delete';
  }

  if (['read', 'detail', 'details', 'view'].includes(lowercaseResourceName)) {
    return 'read';
  }

  if (['list', 'lists'].includes(lowercaseResourceName)) {
    return 'list';
  }

  if (['group', 'groups'].includes(lowercaseResourceName)) {
    return 'group';
  }

  if (
    ['permission', 'permissions', 'role', 'roles'].includes(
      lowercaseResourceName
    )
  ) {
    return 'permission';
  }

  if (['document', 'documents'].includes(lowercaseResourceName)) {
    return 'documents';
  }

  if (['file', 'files'].includes(lowercaseResourceName)) {
    return 'file';
  }

  if (['image', 'images'].includes(lowercaseResourceName)) {
    return 'images';
  }

  if (['video', 'videos'].includes(lowercaseResourceName)) {
    return 'video';
  }

  if (['audio', 'audios'].includes(lowercaseResourceName)) {
    return 'audio';
  }

  if (
    ['calendar', 'calendars', 'event', 'events'].includes(lowercaseResourceName)
  ) {
    return 'calendar';
  }

  if (
    ['message', 'messages', 'chat', 'chats', 'comment', 'comments'].includes(
      lowercaseResourceName
    )
  ) {
    return 'messages';
  }

  if (['search', 'find', 'lookup'].includes(lowercaseResourceName)) {
    return 'search';
  }

  if (
    ['notification', 'notifications', 'alert', 'alerts'].includes(
      lowercaseResourceName
    )
  ) {
    return 'notifications';
  }

  if (['task', 'tasks', 'todo', 'todos'].includes(lowercaseResourceName)) {
    return 'tasks';
  }

  if (
    [
      'location',
      'locations',
      'address',
      'addresses',
      'map',
      'maps',
      'geolocation',
      'geolocations'
    ].includes(lowercaseResourceName)
  ) {
    return 'location';
  }

  if (
    ['project', 'projects', 'portfolio', 'portfolios'].includes(
      lowercaseResourceName
    )
  ) {
    return 'projects';
  }

  if (
    ['invoice', 'invoices', 'receipt', 'receipts', 'bill', 'bills'].includes(
      lowercaseResourceName
    )
  ) {
    return 'invoices';
  }

  if (
    ['report', 'reports', 'analysis', 'analyses'].includes(
      lowercaseResourceName
    )
  ) {
    return 'reports';
  }

  if (
    [
      'bookmark',
      'bookmarks',
      'marker',
      'markers',
      'favorite',
      'favorites'
    ].includes(lowercaseResourceName)
  ) {
    return 'bookmarks';
  }

  if (
    ['contact', 'contacts', 'phonebook', 'phonebooks'].includes(
      lowercaseResourceName
    )
  ) {
    return 'contacts';
  }

  if (
    ['help', 'support', 'faq', 'faqs', 'assist', 'assistance'].includes(
      lowercaseResourceName
    )
  ) {
    return 'help';
  }

  if (
    ['payment', 'payments', 'transaction', 'transactions'].includes(
      lowercaseResourceName
    )
  ) {
    return 'payments';
  }

  if (
    [
      'backup',
      'backups',
      'restore',
      'restores',
      'recovery',
      'recoveries'
    ].includes(lowercaseResourceName)
  ) {
    return 'backups';
  }

  if (
    ['log', 'logs', 'record', 'records', 'history', 'histories'].includes(
      lowercaseResourceName
    )
  ) {
    return 'log';
  }

  if (['download', 'downloads'].includes(lowercaseResourceName)) {
    return 'download';
  }

  if (['upload', 'uploads'].includes(lowercaseResourceName)) {
    return 'upload';
  }

  if (
    ['sync', 'synchronize', 'synchronization'].includes(lowercaseResourceName)
  ) {
    return 'sync';
  }

  if (['export', 'exports'].includes(lowercaseResourceName)) {
    return 'export';
  }

  if (['import', 'imports'].includes(lowercaseResourceName)) {
    return 'import';
  }

  if (['lock', 'locks', 'secure', 'security'].includes(lowercaseResourceName)) {
    return 'lock';
  }

  if (
    ['unlock', 'unlocks', 'unsecure', 'unsecurity'].includes(
      lowercaseResourceName
    )
  ) {
    return 'unlock';
  }

  if (
    ['login', 'logins', 'signin', 'signins'].includes(lowercaseResourceName)
  ) {
    return 'login';
  }

  if (
    ['logout', 'logouts', 'signout', 'signouts'].includes(lowercaseResourceName)
  ) {
    return 'logout';
  }

  if (
    ['account', 'accounts', 'profile', 'profiles'].includes(
      lowercaseResourceName
    )
  ) {
    return 'profile';
  }

  if (
    ['manager', 'managers', 'leader', 'leaders'].includes(lowercaseResourceName)
  ) {
    return 'leader';
  }

  if (
    ['language', 'languages', 'translate', 'translates'].includes(
      lowercaseResourceName
    )
  ) {
    return 'language';
  }

  if (['currency', 'currencies'].includes(lowercaseResourceName)) {
    return 'currency';
  }

  if (
    ['option', 'options', 'check', 'confirm', 'vote', 'votes'].includes(
      lowercaseResourceName
    )
  ) {
    return 'options';
  }

  if (
    [
      'id',
      'ids',
      'identifier',
      'identifiers',
      'name',
      'lastname',
      'firstname',
      'fullname',
      'username',
      'nickname'
    ].includes(lowercaseResourceName)
  ) {
    return 'id';
  }

  if (['url', 'urls', 'link', 'links'].includes(lowercaseResourceName)) {
    return 'link';
  }

  if (
    ['site', 'sites', 'website', 'websites', 'web', 'webs'].includes(
      lowercaseResourceName
    )
  ) {
    return 'website';
  }

  if (
    [
      'status',
      'statuses',
      'state',
      'states',
      'condition',
      'conditions'
    ].includes(lowercaseResourceName)
  ) {
    return 'status';
  }

  if (
    [
      'createdat',
      'created_at',
      'createddate',
      'created_date',
      'updatedat',
      'updated_at',
      'updateddate',
      'updated_date',
      'deletedat',
      'deleted_at',
      'deleteddate',
      'deleted_date',
      'removedat',
      'removed_at',
      'removeddate',
      'removed_date'
    ].includes(lowercaseResourceName)
  ) {
    return 'date';
  }

  if (
    ['color', 'colors', 'colour', 'colours', 'theme', 'themes'].includes(
      lowercaseResourceName
    )
  ) {
    return 'color';
  }

  if (['repository', 'git'].includes(lowercaseResourceName)) {
    return 'repository';
  }

  if (['lambda', 'serverless', 'server'].includes(lowercaseResourceName)) {
    return 'server';
  }

  if (
    [
      'application',
      'applications',
      'app',
      'apps',
      'service',
      'services'
    ].includes(lowercaseResourceName)
  ) {
    return 'application';
  }

  if (
    [
      'author',
      'authors',
      'writer',
      'writers',
      'creator',
      'creators',
      'developer',
      'developers'
    ].includes(lowercaseResourceName)
  ) {
    return 'author';
  }

  if (
    ['email', 'e-mail', 'mail', 'mailbox', 'mailboxes'].includes(
      lowercaseResourceName
    )
  ) {
    return 'email';
  }

  return 'others';
}
