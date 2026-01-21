package org.junotb.api.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Redis 및 Redisson 설정
 * Upstash Redis (rediss:// SSL 프로토콜) 지원
 * 
 * @Profile("!test") - 테스트 환경에서는 실행되지 않음
 */
@Configuration
@Profile("!test")
public class RedisConfig {

    @Value("${spring.data.redis.url}")
    private String redisUrl;

    /**
     * RedissonClient 빈 등록
     * 분산 락을 위한 Redisson 클라이언트 설정
     */
    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer()
            .setAddress(redisUrl)
            .setConnectionPoolSize(10)
            .setConnectionMinimumIdleSize(2)
            .setConnectTimeout(3000)
            .setTimeout(3000);
        
        return Redisson.create(config);
    }

    /**
     * TransactionTemplate 빈 등록
     * 프로그래매틱 트랜잭션 관리를 위한 템플릿
     */
    @Bean
    public TransactionTemplate transactionTemplate(PlatformTransactionManager transactionManager) {
        return new TransactionTemplate(transactionManager);
    }
}
