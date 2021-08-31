// 反射模型
export class Phong{
    constructor(ambientLight = [0.5, 0.5, 0.5]){
        // 定义环境光初始强度
        this.ambientLight = ambientLight;
        // 分别定义平行光、点光源、聚光灯的模型集合，主要作用是添加和删除光源
        this.directionalLights = new Set();
        this.pointLights = new Set();
        this.spotLights = new Set();
    }
    // 添加光源
    addLight(light){
        // position点光源、direction平行光、color光照强度、decay衰减系数、angle角度（聚光灯效果）
        const {position, direction, color, decay, angle} = light;
        // 如果没有输入光类型，抛出异常
        if(!position && !direction) throw new TypeError('invalid light');
        light.color = color || [1.0, 1.0, 1.0];
        // 如果没有添加点光源，直接把平行光加入集合中
        if(!position) this.directionalLights.add(light);
        // 如果是点光源，进行处理（点光源存在光的衰减）
        else{
            // 衰减系数
            light.decay = decay || [0, 0, 1];
            // 判断点光源还是聚光灯
            if(!angle){
                this.pointLights.add(light);
            }else{
                this.spotLights.add(light);
            }
        }
    }
    // 删除光源
    removeLight(light){
        if(this.directionalLights.has(light)) this.directionalLights.delete(light);
        else if(this.pointLights.has(light)) this.pointLights.delete(light);
        else if(this.spotLights.has(light)) this.spotLights.delete(light);
    }

    // 把光源属性通过uniforms访问器属性转换成着色器uniform变量
    get uniforms(){
        const MAX_LIGHT_COUNT = 16; // 最多每种光源设置16个
        this._lightData = this._lightData || {};
        const lightData = this._lightData;

        // 平行光的方向、光的强度
        lightData.directionalLightDirection = lightData.directionalLightDirection || { value: new Float32Array(MAX_LIGHT_COUNT * 3) };
        lightData.directionalLightColor = lightData.directionalLightColor || { value: new Float32Array(MAX_LIGHT_COUNT * 3) };

        // 点光源的位置、光强度、衰减系数
        lightData.pointLightPosition = lightData.pointLightPosition || { value: new Float32Array(MAX_LIGHT_COUNT * 3) };    
        lightData.pointLightColor = lightData.pointLightColor || { value: new Float32Array(MAX_LIGHT_COUNT * 3) };    
        lightData.pointLightDecay = lightData.pointLightDecay || { value: new Float32Array(MAX_LIGHT_COUNT * 3) };

        // 聚光灯的方向、位置、光强度、衰减系数、角度
        lightData.spotLightDirection = lightData.spotLightDirection || { value: new Float32Array(MAX_LIGHT_COUNT * 3) }; 
        lightData.spotLightPosition = lightData.spotLightPosition || { value: new Float32Array(MAX_LIGHT_COUNT * 3) }; 
        lightData.spotLightColor = lightData.spotLightColor || { value: new Float32Array(MAX_LIGHT_COUNT * 3) }; 
        lightData.spotLightDecay = lightData.spotLightDecay || { value: new Float32Array(MAX_LIGHT_COUNT * 3) }; 
        lightData.spotLightAngle = lightData.spotLightAngle || { value: new Float32Array(MAX_LIGHT_COUNT) };

        // 平行光的所有uniform集合
        [...this.directionalLights].forEach((light, idx) => {
            // set方法会将源数组的所有值都会被复制到相应偏移量的目标数组中
            lightData.directionalLightDirection.value.set(light.direction, idx * 3);      
            lightData.directionalLightColor.value.set(light.color, idx * 3);
        });

        // 点光源的所有uniform集合
        [...this.pointLights].forEach((light, idx) => {
            lightData.pointLightPosition.value.set(light.position, idx * 3);      
            lightData.pointLightColor.value.set(light.color, idx * 3);
            lightData.pointLightDecay.value.set(light.decay, idx * 3);
        });

        // 聚光灯的所有uniform集合
        [...this.spotLights].forEach((light, idx) => {
            lightData.spotLightDirection.value.set(light.direction, idx * 3);      
            lightData.spotLightPosition.value.set(light.position, idx * 3);      
            lightData.spotLightColor.value.set(light.color, idx * 3);
            lightData.spotLightDecay.value.set(light.decay, idx * 3);
            lightData.spotLightAngle.value.set(light.angle, idx * 3);
        });

        return  { 
                    ambientLight: { value: this.ambientLight }, 
                    ...lightData, 
                };
    }
}

// 材质
export class Material{
    constructor(reflection, specularFactor = 0, shininess = 50){
        // 几何体材质反射率（漫反射相关）
        this.reflection = reflection;
        // 几何体镜面反射强度（镜面反射相关）
        this.specularFactor = specularFactor;
        // 几何体镜面反射光洁度（镜面反射相关）
        this.shininess = shininess;
    }

    // 把材质属性通过uniforms访问器属性转换成着色器uniform变量
    get uniforms(){
        return  { 
                    materialReflection: { value: this.reflection }, 
                    specularFactor: { value: this.specularFactor }, 
                    shininess: { value: this.shininess }, 
                };
    }
}