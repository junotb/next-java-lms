package org.junotb.api.config;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * 테스트 환경용 Redis 설정
 * Mock RedissonClient를 제공하여 실제 Redis 연결 없이 테스트 가능
 */
@Configuration
@Profile("test")
public class TestRedisConfig {

    /**
     * Mock RedissonClient 빈 등록
     * 테스트 환경에서는 실제 Redis 대신 Mock 사용
     */
    @Bean
    @Primary
    public RedissonClient redissonClient() {
        RedissonClient redissonClient = mock(RedissonClient.class);
        RLock lock = mock(RLock.class);
        
        // 기본 동작 설정
        when(redissonClient.getLock(anyString())).thenReturn(lock);
        
        return redissonClient;
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
