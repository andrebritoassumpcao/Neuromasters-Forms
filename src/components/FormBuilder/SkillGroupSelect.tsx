import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { apiService } from "../../services/api";

interface Option {
  value: string;
  label: string;
}

interface SkillGroupDto {
  code: string;
  description: string;
}

interface Props {
  value: string | null;
  onChange: (newValue: Option | null) => void;
  options: Option[];
}

const SkillGroupSelect: React.FC<Props> = ({ value, onChange }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Buscar grupos da API ao montar
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // 🚨 PRIMEIRO DEBUG: Vamos ver o que a API retorna
        const response = await apiService.getSkillGroups();

        // 🚨 SEGUNDO DEBUG: Verificar se tem skillGroups
        const groupsFromApi: SkillGroupDto[] = response || response;

        const mappedOptions = groupsFromApi.map((g) => ({
          value: g.code,
          label: g.description,
        }));

        setOptions(mappedOptions);
      } catch (error) {
        console.error("❌ Erro ao carregar grupos:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Debug do value recebido
  useEffect(() => {
    console.log("🔄 Value recebido:", value);
    console.log("🔄 Options disponíveis:", options);
    console.log(
      "🔄 Option encontrada:",
      options.find((o) => o.value === value)
    );
  }, [value, options]);

  // 🔹 Criar novo grupo se não existir
  const handleCreate = async (inputValue: string) => {
    try {
      console.log("➕ Criando novo grupo:", inputValue);
      const code = Math.random().toString().slice(2, 8);
      const novoGrupo = (await apiService.createSkillGroup({
        code,
        description: inputValue,
      })) as SkillGroupDto;

      const newOption: Option = {
        value: novoGrupo.code,
        label: novoGrupo.description,
      };

      setOptions((prev) => [...prev, newOption]);
      onChange(newOption);
    } catch (error) {
      console.error("❌ Erro ao criar grupo:", error);
    }
  };

  return (
    <CreatableSelect
      isClearable
      isDisabled={loading}
      isLoading={loading}
      onChange={(newValue) => {
        console.log("🔄 Select onChange:", newValue);
        onChange(newValue as Option | null);
      }}
      onCreateOption={handleCreate}
      options={options}
      value={
        options.find((o) => o.value === value) ||
        (value ? { value, label: value } : null)
      }
      placeholder="Selecione ou crie um grupo..."
      formatCreateLabel={(inputValue) => `Criar "${inputValue}"`}
      menuPortalTarget={document.body} // 🔹 renderiza fora do container
      styles={{
        container: (base) => ({ ...base, width: "100%" }),
        control: (base) => ({
          ...base,
          minHeight: "40px",
          borderColor: "#d1d5db",
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // 🔹 fica no topo
        menu: (base) => ({ ...base, zIndex: 9999 }), // 🔹 extra segurança
      }}
    />
  );
};

export default SkillGroupSelect;
