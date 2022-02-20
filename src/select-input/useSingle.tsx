import { SetupContext, ref, VNode, watch, computed, toRefs } from 'vue';
import isObject from 'lodash/isObject';
import pick from 'lodash/pick';
import Input, { InputValue } from '../input';
import { SelectInputCommonProperties } from './interface';
import { TdSelectInputProps } from './type';

export interface RenderSelectSingleInputParams {
  prefixContent: VNode[];
  singleValueDisplay: VNode;
}

// single 和 multiple 共有特性
const COMMON_PROPERTIES = [
  'status',
  'tips',
  'clearable',
  'disabled',
  'label',
  'placeholder',
  'readonly',
  'suffix',
  'suffixIcon',
  'onPaste',
  'onEnter',
  'onMouseenter',
  'onMouseleave',
];

const DEFAULT_KEYS = {
  label: 'label',
  key: 'key',
};

export default function useSingle(props: TdSelectInputProps, context: SetupContext) {
  const { value } = toRefs(props);
  const inputRef = ref();
  const inputValue = ref<string | number>('');

  const commonInputProps = computed<SelectInputCommonProperties>(() => pick(props, COMMON_PROPERTIES));

  const onInnerClear = (context: { e: MouseEvent }) => {
    context?.e?.stopPropagation();
    props.onClear?.(context);
    inputValue.value = '';
  };

  const onInnerInputChange = (value: InputValue, context: { e: InputEvent | MouseEvent }) => {
    if (props.allowInput) {
      inputValue.value = value;
      props.onInputChange?.(value, context);
    }
  };

  watch(
    [value],
    () => {
      const iKeys = { ...DEFAULT_KEYS, ...props.keys };
      inputValue.value = isObject(value.value) ? value.value[iKeys.label] : value.value;
    },
    { immediate: true },
  );

  const renderSelectSingle = (p: RenderSelectSingleInputParams) => {
    return (
      <Input
        ref="inputRef"
        {...commonInputProps.value}
        v-slots={{ ...context.slots }}
        autoWidth={props.borderless || props.autoWidth}
        placeholder={p.singleValueDisplay ? '' : props.placeholder}
        value={p.singleValueDisplay ? undefined : inputValue.value}
        label={p.prefixContent.length ? () => p.prefixContent : undefined}
        onChange={onInnerInputChange}
        readonly={!props.allowInput}
        onClear={onInnerClear}
        onBlur={(val, context) => {
          props.onBlur?.(value, { ...context, inputValue: val });
        }}
        onFocus={(val, context) => {
          props.onFocus?.(value, { ...context, inputValue: val });
        }}
        {...props.inputProps}
      />
    );
  };

  return {
    inputRef,
    commonInputProps,
    onInnerClear,
    renderSelectSingle,
  };
}
