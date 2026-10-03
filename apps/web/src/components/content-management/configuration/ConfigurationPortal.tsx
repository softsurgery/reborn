import { Button } from "@reborn/ui";
import { useBreadcrumb } from "@reborn/contexts";
import { useIntro } from "@reborn/contexts";
import { useConfigurations } from "@/hooks/content/configuration/useConfigurations";
import { useConfigStore } from "@/hooks/stores/userConfigStore";
import { cn } from "@reborn/lib";
import _ from "lodash";
import React from "react";
import { ConfigurationInput } from "./ConfigurationInput";
import { Label } from "@reborn/ui";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api";
import { Loader2, Search } from "lucide-react";
import { useTranslation } from "@reborn/i18n";
import { Input } from "@reborn/ui";
import { Separator } from "@reborn/ui";
import SidebarNav from "@/components/shared/SidebarNav";

interface ConfigurationPortalProps {
  className?: string;
}

export const ConfigurationPortal = ({
  className,
}: ConfigurationPortalProps) => {
  const { t } = useTranslation("content-management");
  const { setIntro, clearIntro, setFloating, clearFloating } = useIntro();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { configurations, isConfigurationsPending, refetchConfigurations } =
    useConfigurations();
  const configStore = useConfigStore();

  const originalValuesRef = React.useRef<{ id: number; value: string }[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeConfigId, setActiveConfigId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (configurations && configStore.updateDtos.length === 0) {
      const allParams = configurations.flatMap(
        (namespace) => namespace.params || [],
      );

      const initialUpdateDtos = allParams.map((param) => ({
        id: param.id,
        value: param.value || "",
      }));

      originalValuesRef.current = initialUpdateDtos;
      configStore.set("updateDtos", initialUpdateDtos);
    }
  }, [configurations]);

  const { mutate: updateConfigs, isPending: isSaving } = useMutation({
    mutationFn: async (data: { id: number; value: string }[]) => {
      return api.admin.configuration.update(data);
    },
    onSuccess: () => {
      refetchConfigurations();
      toast.success(t("configuration.messages.updateSuccess"));
    },
    onError: (error) => {
      toast.error(error.message || t("configuration.messages.updateError"));
    },
  });

  const handleSave = () => {
    const latestUpdateDtos = useConfigStore.getState().updateDtos;
    updateConfigs(latestUpdateDtos);
  };

  const handleReset = () => {
    configStore.set("updateDtos", [...originalValuesRef.current]);
    toast.info(t("configuration.messages.resetSuccess"));
  };

  React.useEffect(() => {
    setRoutes?.([
      {
        title: t("configuration.breadcrumbs.contentManagement"),
        href: "/content-management",
      },
      {
        title: t("configuration.breadcrumbs.configuration"),
        href: "/content-management/configuration",
      },
    ]);

    setIntro?.(
      t("configuration.page.title"),
      t("configuration.page.description"),
    );

    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, []);

  const filteredConfigs = React.useMemo(
    () =>
      configurations
        ?.map((config) => ({
          ...config,
          params: config.params?.filter((param) =>
            param.name?.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((config) => config.params?.length !== 0),
    [configurations, searchQuery],
  );

  React.useEffect(() => {
    if (filteredConfigs && filteredConfigs.length > 0) {
      if (!activeConfigId || !filteredConfigs.find((c) => c.id.toString() === activeConfigId)) {
        setActiveConfigId(filteredConfigs[0].id.toString());
      }
    } else {
      setActiveConfigId(null);
    }
  }, [filteredConfigs, activeConfigId]);

  const sidebarItems = React.useMemo(() => {
    return (filteredConfigs || []).map((config) => ({
      href: `#${config.id}`,
      title: _.capitalize(config.name),
    }));
  }, [filteredConfigs]);

  const activeConfig = filteredConfigs?.find((c) => c.id.toString() === activeConfigId);

  if (isConfigurationsPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">
          {t("configuration.loading.configurations")}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col flex-1 gap-4 overflow-hidden container mx-auto p-1 mt-4",
        className,
      )}
    >
      {/* search bar */}
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search params..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <Separator className="shrink-0" />

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="w-1/4 min-w-[250px] overflow-y-auto no-scrollbar pb-4">
          <SidebarNav
            items={sidebarItems}
            activeHref={`#${activeConfigId}`}
            onSelect={(item) => setActiveConfigId(item.href.replace("#", ""))}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar pb-4">
          {activeConfig ? (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {_.capitalize(activeConfig.name)}
                </h2>
                {activeConfig.description && (
                  <p className="text-muted-foreground mt-1">
                    {activeConfig.description}
                  </p>
                )}
              </div>
              <Separator />
              <div className="flex flex-col gap-10">
                {Object.entries(
                  _.groupBy(
                    activeConfig.params,
                    (param) => param.name?.split(".")[0],
                  ),
                ).map(([groupKey, params]) => (
                  <div
                    key={groupKey}
                    className="flex flex-col gap-4"
                  >
                    <div className="mb-2">
                      <h3 className="text-lg font-medium capitalize tracking-tight">
                        {groupKey}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("configuration.groups.count", {
                          count: params.length,
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col gap-6">
                      {params
                        .sort((a, b) => a.variant.localeCompare(b.variant))
                        .map((param) => (
                          <div
                            key={param.id}
                            className="flex flex-col gap-3 lg:flex-row lg:items-start justify-between"
                          >
                            <div className="lg:w-1/2">
                              <Label className="text-sm font-medium">
                                {_.startCase(
                                  _.camelCase(param.name?.split(".")[1]),
                                )}
                              </Label>
                              {param.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {param.description}
                                </p>
                              )}
                            </div>
                            <div className="lg:w-1/2 lg:max-w-md">
                              <ConfigurationInput
                                configurationParam={param}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {searchQuery
                ? "No configuration params match your search"
                : configurations?.length === 0
                  ? "No configurations available"
                  : "Select a configuration"}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 pt-4 pb-2 mt-auto border-t flex justify-end gap-2">
        <Button variant={"secondary"} onClick={handleReset} disabled={isSaving}>
          {t("configuration.actions.resetAll")}
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("configuration.actions.saving")}
            </>
          ) : (
            t("configuration.actions.saveChanges")
          )}
        </Button>
      </div>
    </div>
  );
};
