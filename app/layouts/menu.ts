import { ref, computed } from "vue";
import type { NavigationMenuItem } from "@nuxt/ui";
import { moduleKey } from "~/utils/module-key";

type ModuleMenuItem = NavigationMenuItem & {
  module_key?: string;
  children?: ModuleMenuItem[];
};

export const useMenu = () => {
  const open = ref(false);
  const userStore = useUserStore();

  const isSuperAdmin = computed(() => userStore.isSuperAdmin);

  const canViewMenuItem = (item: ModuleMenuItem) => {
    return !item.module_key || userStore.hasModule(item.module_key);
  };

  const filterByModule = (items: ModuleMenuItem[]): ModuleMenuItem[] => {
    return items
      .map((item) => {
        const children = item.children
          ? filterByModule(item.children)
          : undefined;

        return {
          ...item,
          ...(children ? { children } : {}),
        };
      })
      .filter((item) => {
        if (!canViewMenuItem(item)) return false;
        if (item.children) return item.children.length > 0;
        return true;
      });
  };

  const links = computed<NavigationMenuItem[][]>(() => [
    filterByModule([
      {
        label: "Dashboard",
        icon: "i-lucide-layout-dashboard",
        to: "/",
        module_key: moduleKey.DASHBOARD,
      },
      // Deployment
      {
        label: "Deployments",
        icon: "i-lucide-rocket",
        type: "trigger",
        children: [
          {
            label: "Deployments",
            to: "/deployments",
            module_key: moduleKey.DEPLOY,
          },
          {
            label: "Deploy History",
            to: "/deployments/history",
            module_key: moduleKey.GIT_HISTORY,
          },
          {
            label: "Domains",
            to: "/deployments/domains",
            module_key: moduleKey.DOMAINS,
          },
        ],
      },
      // Database
      {
        label: "Databases",
        icon: "i-lucide-database",
        type: "trigger",
        children: [
          {
            label: "Databases",
            to: "/databases",
            module_key: moduleKey.DATABASE,
          },
          {
            label: "Database Backups",
            to: "/databases/backups",
            module_key: moduleKey.DB_BACKUPS,
          },
        ],
      },
      // Files & FTP
      {
        label: "Files & FTP",
        icon: "i-lucide-folder",
        type: "trigger",
        badge: "VPS",
        children: [
          {
            label: "File Manager",
            to: "/files",
            badge: "VPS",
            module_key: moduleKey.FILE_MANAGEMER,
          },
          {
            label: "FTP Accounts",
            to: "/files/ftp",
            badge: "VPS",
            module_key: moduleKey.FTP_ACC,
          },
          {
            label: "Storage Usage",
            to: "/files/storage",
            badge: "VPS",
            module_key: moduleKey.STORAGE_USAGE,
          },
        ],
      },
      // Email
      {
        label: "Email",
        icon: "i-lucide-mail",
        type: "trigger",
        badge: "VPS",
        children: [
          {
            label: "Mailboxes",
            to: "/email/mailboxes",
            module_key: moduleKey.MAILBOXES,
          },
          {
            label: "Create Email",
            to: "/email/create",
            module_key: moduleKey.CREATE_MAIL,
          },
          {
            label: "Forwarders",
            to: "/email/forwarders",
            module_key: moduleKey.FORWARDER,
          },
          {
            label: "Autoresponders",
            to: "/email/autoresponders",
            module_key: moduleKey.AUTO_RESPONE,
          },
          {
            label: "Mail Logs",
            to: "/email/logs",
            module_key: moduleKey.MAIL_LOGS,
          },
        ],
      },
      // DNS
      {
        label: isSuperAdmin.value ? "DNS Manager" : "My DNS",
        icon: "i-lucide-network",
        to: "/dns",
        badge: "VPS",
        module_key: moduleKey.DNS,
      },
      // Backups
      {
        label: "Backups",
        icon: "i-lucide-archive",
        type: "trigger",
        badge: "VPS",
        children: [
          {
            label: isSuperAdmin.value ? "All Backups" : "My Backups",
            to: "/backups",
            module_key: moduleKey.BACKUPS,
          },
          {
            label: "Backup Schedules",
            to: "/backups/schedules",
            module_key: moduleKey.BACKUP_SCHEDULES,
          },
          {
            label: "Restore",
            to: "/backups/restore",
            module_key: moduleKey.BACKUP_RESTORE,
          },
          {
            label: "Remote Storage",
            to: "/backups/storage",
            module_key: moduleKey.REMOTE_STORAGE,
          },
        ],
      },
      {
        label: "Support",
        icon: "i-lucide-life-buoy",
        type: "trigger" as const,
        children: [
          {
            label: "Tickets",
            to: "/support/tickets",
            module_key: moduleKey.TICKETS,
          },
          {
            label: "Knowledge Base",
            to: "/support/knowledge-base",
          },
          {
            label: "Announcements",
            to: "/support/announcements",
          },
        ],
      },
      {
        label: "Settings",
        icon: "i-lucide-settings",
        to: "/settings",
      },
    ]),
  ]);

  return {
    open,
    links,
  };
};
